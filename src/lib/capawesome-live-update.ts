import { Capacitor } from '@capacitor/core';

export class CapawesomeLiveUpdateService {
  private LiveUpdate: any = null;
  private pluginLoaded = false;

  private async loadPlugin(): Promise<void> {
    if (this.pluginLoaded) return;

    try {
      const module = await import('@capawesome-team/capacitor-live-update');
      this.LiveUpdate = module.LiveUpdate;
      this.pluginLoaded = true;
    } catch (error) {
      console.log('Capawesome Live Update plugin not installed yet');
      this.pluginLoaded = false;
    }
  }

  private async isAvailable(): Promise<boolean> {
    await this.loadPlugin();
    return this.LiveUpdate !== null && Capacitor.isNativePlatform();
  }

  async initialize(): Promise<void> {
    if (!(await this.isAvailable())) {
      console.log('Live updates are not available (plugin not installed or not on native platform)');
      return;
    }

    try {
      await this.LiveUpdate.ready();
      console.log('Capawesome Live Update initialized');

      const currentBundle = await this.LiveUpdate.getCurrentBundle();
      console.log('Current bundle:', currentBundle);

      await this.checkForUpdates();
    } catch (error) {
      console.error('Failed to initialize Capawesome Live Update:', error);
    }
  }

  async checkForUpdates(): Promise<void> {
    if (!(await this.isAvailable())) return;

    try {
      const result = await this.LiveUpdate.sync();

      if (result.nextBundleId) {
        console.log('Update available:', result.nextBundleId);
        await this.LiveUpdate.reload();
      } else {
        console.log('App is up to date');
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }

  async getCurrentBundleInfo(): Promise<any> {
    if (!(await this.isAvailable())) return null;

    try {
      return await this.LiveUpdate.getCurrentBundle();
    } catch (error) {
      console.error('Failed to get current bundle info:', error);
      return null;
    }
  }

  async downloadUpdate(): Promise<void> {
    if (!(await this.isAvailable())) {
      throw new Error('Live Update plugin not available');
    }

    try {
      await this.LiveUpdate.download();
      console.log('Update downloaded successfully');
    } catch (error) {
      console.error('Failed to download update:', error);
      throw error;
    }
  }

  async reloadApp(): Promise<void> {
    if (!(await this.isAvailable())) {
      throw new Error('Live Update plugin not available');
    }

    try {
      await this.LiveUpdate.reload();
    } catch (error) {
      console.error('Failed to reload app:', error);
      throw error;
    }
  }
}

export const liveUpdateService = new CapawesomeLiveUpdateService();
