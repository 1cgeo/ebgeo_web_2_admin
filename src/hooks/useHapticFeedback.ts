// Path: hooks\useHapticFeedback.ts
export const useHapticFeedback = () => {
  const isVibrationAvailable = 'vibrate' in navigator;

  const vibrate = (pattern: number | number[]) => {
    if (isVibrationAvailable) {
      navigator.vibrate(pattern);
    }
  };

  const successVibration = () => vibrate([50]);
  const errorVibration = () => vibrate([100, 50, 100]);
  const buttonPressVibration = () => vibrate(20);

  return {
    isVibrationAvailable,
    vibrate,
    successVibration,
    errorVibration,
    buttonPressVibration,
  };
};
