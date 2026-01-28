import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export interface CameraImage {
  webPath?: string;
  base64String?: string;
  format: string;
}

export const takePhoto = async (): Promise<CameraImage | null> => {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const photo: Photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    return {
      webPath: photo.webPath,
      base64String: photo.base64String,
      format: photo.format,
    };
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
};

export const selectPhoto = async (): Promise<CameraImage | null> => {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const photo: Photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    return {
      webPath: photo.webPath,
      base64String: photo.base64String,
      format: photo.format,
    };
  } catch (error) {
    console.error('Error selecting photo:', error);
    return null;
  }
};

export const selectMultiplePhotos = async (maxPhotos: number = 4): Promise<CameraImage[]> => {
  const photos: CameraImage[] = [];

  for (let i = 0; i < maxPhotos; i++) {
    const photo = await selectPhoto();
    if (photo) {
      photos.push(photo);
    } else {
      break;
    }
  }

  return photos;
};

export const convertPhotoToFile = async (photo: CameraImage): Promise<File | null> => {
  if (!photo.webPath) {
    return null;
  }

  try {
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    const fileName = `photo_${Date.now()}.${photo.format}`;
    return new File([blob], fileName, { type: `image/${photo.format}` });
  } catch (error) {
    console.error('Error converting photo to file:', error);
    return null;
  }
};
