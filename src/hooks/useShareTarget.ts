import { useState, useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { isPlatform } from '../utils/platform';

export interface SharedContent {
  url?: string;
  title?: string;
  description?: string;
  text?: string;
  files?: string[];
  source?: 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'youtube' | 'other';
}

export function useShareTarget() {
  const [sharedContent, setSharedContent] = useState<SharedContent | null>(null);

  useEffect(() => {
    if (!isPlatform('capacitor')) return;

    const handleAppUrl = CapApp.addListener('appUrlOpen', (data) => {
      try {
        const url = data.url;

        const parsedContent = parseSharedUrl(url);
        if (parsedContent) {
          setSharedContent(parsedContent);
        }
      } catch (error) {
        console.error('Error parsing shared URL:', error);
      }
    });

    const handleResume = CapApp.addListener('appStateChange', (state) => {
      if (state.isActive) {
        checkForPendingShares();
      }
    });

    checkForPendingShares();

    return () => {
      handleAppUrl.remove();
      handleResume.remove();
    };
  }, []);

  const checkForPendingShares = async () => {
    try {
      const launchUrl = await CapApp.getLaunchUrl();
      if (launchUrl?.url) {
        const parsedContent = parseSharedUrl(launchUrl.url);
        if (parsedContent) {
          setSharedContent(parsedContent);
        }
      }
    } catch (error) {
      console.error('Error checking for pending shares:', error);
    }
  };

  const parseSharedUrl = (url: string): SharedContent | null => {
    try {
      if (!url.includes('share')) return null;

      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);

      const sharedUrl = params.get('url') || params.get('link');
      const title = params.get('title');
      const description = params.get('description') || params.get('text');
      const text = params.get('text');

      let source: SharedContent['source'] = 'other';
      if (sharedUrl) {
        if (sharedUrl.includes('instagram.com')) source = 'instagram';
        else if (sharedUrl.includes('facebook.com') || sharedUrl.includes('fb.com')) source = 'facebook';
        else if (sharedUrl.includes('tiktok.com')) source = 'tiktok';
        else if (sharedUrl.includes('twitter.com') || sharedUrl.includes('x.com')) source = 'twitter';
        else if (sharedUrl.includes('youtube.com') || sharedUrl.includes('youtu.be')) source = 'youtube';
      }

      if (!sharedUrl && !text) return null;

      return {
        url: sharedUrl || undefined,
        title: title || undefined,
        description: description || undefined,
        text: text || undefined,
        source
      };
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  };

  const clearSharedContent = () => {
    setSharedContent(null);
  };

  return {
    sharedContent,
    clearSharedContent,
    hasSharedContent: !!sharedContent
  };
}
