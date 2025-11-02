import { useSubscribeToWebPushMutation } from '@services/notificationsApi';

export async function registerNotifications() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    console.log('Notification permission denied');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/notification-sw.js');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
    });

    return subscription;
  } catch (error) {
    console.error('Error registering push notifications:', error);
    return null;
  }
}

export function useRegisterPushNotification() {
  const [subscribe] = useSubscribeToWebPushMutation();

  const register = async () => {
    const subscription = await registerNotifications();
    if (subscription) {
      try {
        await subscribe(subscription).unwrap();
        return true;
      } catch (error) {
        console.error('Failed to register push subscription:', error);
        return false;
      }
    }
    return false;
  };

  return register;
}
