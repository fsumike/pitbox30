import { supabase } from '../lib/supabase';

interface CacheConfig {
  maxAge: number;
  priority: 'high' | 'medium' | 'low';
}

const CACHE_CONFIGS: Record<string, CacheConfig> = {
  setups: { maxAge: 7 * 24 * 60 * 60 * 1000, priority: 'high' },
  tracks: { maxAge: 30 * 24 * 60 * 60 * 1000, priority: 'high' },
  profile: { maxAge: 24 * 60 * 60 * 1000, priority: 'medium' },
  friends: { maxAge: 24 * 60 * 60 * 1000, priority: 'medium' },
  checklists: { maxAge: 30 * 24 * 60 * 60 * 1000, priority: 'high' },
  lapTimes: { maxAge: 7 * 24 * 60 * 60 * 1000, priority: 'medium' },
  trackConditions: { maxAge: 6 * 60 * 60 * 1000, priority: 'low' },
};

class OfflineCache {
  private dbName = 'pitbox_offline_cache';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('cache')) {
          const store = db.createObjectStore('cache', { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('priority', 'priority');
        }

        if (!db.objectStoreNames.contains('pending_operations')) {
          db.createObjectStore('pending_operations', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async set(key: string, data: any, config?: Partial<CacheConfig>) {
    if (!this.db) await this.init();

    const fullConfig = {
      ...CACHE_CONFIGS[key.split(':')[0]],
      ...config,
    };

    const transaction = this.db!.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');

    const cacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      maxAge: fullConfig.maxAge,
      priority: fullConfig.priority,
    };

    return new Promise<void>((resolve, reject) => {
      const request = store.put(cacheEntry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get(key: string) {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['cache'], 'readonly');
    const store = transaction.objectStore('cache');

    return new Promise<any>((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const entry = request.result;
        if (!entry) {
          resolve(null);
          return;
        }

        if (Date.now() - entry.timestamp > entry.maxAge) {
          this.delete(key);
          resolve(null);
          return;
        }

        resolve(entry.data);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async delete(key: string) {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');

    return new Promise<void>((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear() {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');

    return new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async addPendingOperation(operation: any) {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['pending_operations'], 'readwrite');
    const store = transaction.objectStore('pending_operations');

    return new Promise<number>((resolve, reject) => {
      const request = store.add({
        ...operation,
        timestamp: Date.now(),
      });
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingOperations() {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['pending_operations'], 'readonly');
    const store = transaction.objectStore('pending_operations');

    return new Promise<any[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removePendingOperation(id: number) {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['pending_operations'], 'readwrite');
    const store = transaction.objectStore('pending_operations');

    return new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async syncPendingOperations() {
    const operations = await this.getPendingOperations();

    for (const operation of operations) {
      try {
        if (operation.type === 'insert') {
          await supabase.from(operation.table).insert(operation.data);
        } else if (operation.type === 'update') {
          await supabase
            .from(operation.table)
            .update(operation.data)
            .eq('id', operation.id);
        } else if (operation.type === 'delete') {
          await supabase.from(operation.table).delete().eq('id', operation.id);
        }

        await this.removePendingOperation(operation.id);
      } catch (error) {
        console.error('Failed to sync operation:', error);
      }
    }
  }

  async cacheUserSetups(userId: string) {
    try {
      const { data, error } = await supabase
        .from('setups')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      await this.set(`setups:${userId}`, data);
      return data;
    } catch (error) {
      console.error('Failed to cache setups:', error);
      return await this.get(`setups:${userId}`);
    }
  }

  async cacheTrackLocations() {
    try {
      const { data, error } = await supabase
        .from('track_locations')
        .select('*');

      if (error) throw error;

      await this.set('tracks:all', data);
      return data;
    } catch (error) {
      console.error('Failed to cache tracks:', error);
      return await this.get('tracks:all');
    }
  }

  async cacheMaintenanceChecklists(carClass: string) {
    try {
      const { data, error } = await supabase
        .from('maintenance_checklists')
        .select('*')
        .eq('car_class', carClass);

      if (error) throw error;

      await this.set(`checklists:${carClass}`, data);
      return data;
    } catch (error) {
      console.error('Failed to cache checklists:', error);
      return await this.get(`checklists:${carClass}`);
    }
  }

  async prefetchForTrack(trackId: string, userId: string) {
    try {
      const [setups, conditions, lapTimes] = await Promise.all([
        supabase
          .from('setups')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('track_conditions')
          .select('*')
          .eq('track_id', trackId)
          .gte('reported_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from('lap_times')
          .select('*')
          .eq('user_id', userId)
          .eq('track_id', trackId),
      ]);

      await Promise.all([
        this.set(`setups:${userId}:${trackId}`, setups.data),
        this.set(`conditions:${trackId}`, conditions.data),
        this.set(`laptimes:${userId}:${trackId}`, lapTimes.data),
      ]);

      } catch (error) {
      console.error('Failed to prefetch track data:', error);
    }
  }
}

export const offlineCache = new OfflineCache();

export const initOfflineSupport = async () => {
  try {
    await offlineCache.init();
    window.addEventListener('online', () => {
      offlineCache.syncPendingOperations();
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await Promise.all([
        offlineCache.cacheUserSetups(user.id),
        offlineCache.cacheTrackLocations(),
      ]);
    }
  } catch (error) {
    console.error('Failed to initialize offline support:', error);
  }
};
