// composables/useNotification.ts
import { ref } from 'vue';

interface NotificationOptions {
  message: string;
  type?: 'success' | 'error' | 'info';
  timeout?: number;
}

export const useNotification = () => {
  const showNotification = ref(false);
  const notificationMessage = ref('');
  const notificationType = ref<'success' | 'error' | 'info'>('info');
  const notificationTimeout = ref(3000);

  const notify = (options: NotificationOptions) => {
    notificationMessage.value = options.message;
    notificationType.value = options.type || 'info';
    notificationTimeout.value = options.timeout || 3000;
    showNotification.value = true;
  };

  const hideNotification = () => {
    showNotification.value = false;
  };

  return {
    showNotification,
    notificationMessage,
    notificationType,
    notificationTimeout,
    notify,
    hideNotification
  };
};