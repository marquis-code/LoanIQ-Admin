// src/utils/clipboard-utils.ts

import { useCustomToast } from '@/composables/core/useCustomToast';

export function copyToClipboard(text: string | undefined) {
  const { showToast } = useCustomToast();

  if (text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast({
          title: 'Copied',
          message: 'Text copied to clipboard!',
          toastType: 'success',
          duration: 2000,
        });
      })
      .catch(err => {
        showToast({
          title: 'Error',
          message: 'Failed to copy!',
          toastType: 'error',
          duration: 2000,
        });
        console.error('Failed to copy text: ', err);
      });
  } else {
    showToast({
      title: 'Error',
      message: 'No text to copy!',
      toastType: 'error',
      duration: 2000,
    });
  }
}
