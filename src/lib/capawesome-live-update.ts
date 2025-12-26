import { Capacitor } from '@capacitor/core';

export class CapawesomeLiveUpdateService {
  private LiveUpdate: any = null;

  private isAvailable(): boolean {
    return Capacitor.isNativePlatform();
  }

  private async loadPlugin(): Promise<any> {
    if (this.LiveUpdate) return this.LiveUpdate;

    if (!this.isAvailable()) {
      return null;
    }

    try {
      const module = await import('@capawesome/capacitor-live-update');
      this.LiveUpdate = module.LiveUpdate;
      return this.LiveUpdate;
    } catch (error) {
      console.log('Live Update plugin not available');
      return null;
    }
  }

  async initialize(): Promise<void> {
    const LiveUpdate = await this.loadPlugin();
    if (!LiveUpdate) return;

    try {
      await LiveUpdate.ready();
      const currentBundle = await LiveUpdate.getBundle();
      await this.checkForUpdates();
    } catch (error) {
      console.log('Live Update plugin not available');
    }
  }

  async checkForUpdates(): Promise<void> {
    const LiveUpdate = await this.loadPlugin();
    if (!LiveUpdate) return;

    try {
      const result = await LiveUpdate.sync();

      if (result.nextBundleId) {
        await LiveUpdate.reload();
      }
    } catch (error) {
      console.log('Failed to check for updates');
    }
  }

  async getCurrentBundleInfo(): Promise<{ bundleId: string | null } | null> {
    const LiveUpdate = await this.loadPlugin();
    if (!LiveUpdate) return null;

    try {
      return await LiveUpdate.getBundle();
    } catch (error) {
      return null;
    }
  }

  async reloadApp(): Promise<void> {
    const LiveUpdate = await this.loadPlugin();
    if (!LiveUpdate) {
      throw new Error('Live Update plugin not available');
    }

    try {
      await LiveUpdate.reload();
    } catch (error) {
      throw error;
    }
  }
}

export const liveUpdateService = new CapawesomeLiveUpdateService();
