import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
  try {
    await Haptics.impact({ style });
  } catch (err) {
    // Haptics not available, silently ignore
  }
};

export const triggerLightHaptic = () => triggerHaptic(ImpactStyle.Light);
export const triggerMediumHaptic = () => triggerHaptic(ImpactStyle.Medium);
export const triggerHeavyHaptic = () => triggerHaptic(ImpactStyle.Heavy);

export const triggerSelectionHaptic = async () => {
  try {
    await Haptics.selectionStart();
    await Haptics.selectionChanged();
    await Haptics.selectionEnd();
  } catch (err) {
    // Haptics not available, silently ignore
  }
};

export const triggerNotificationHaptic = async (type: 'success' | 'warning' | 'error' = 'success') => {
  try {
    await Haptics.notification({ type: type.toUpperCase() as any });
  } catch (err) {
    // Haptics not available, silently ignore
  }
};
