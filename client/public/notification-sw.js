self.addEventListener('push', function (event) {
  const data = event.data.json();
  const options = {
    body: data.message,
    icon: '/icons/notification-icon.png',
    badge: '/icons/notification-badge.png',
    data: data.data,
    actions: [
      {
        action: 'open',
        title: 'Open',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  if (event.action === 'open') {
    const data = event.notification.data;
    if (data && data.url) {
      event.waitUntil(clients.openWindow(data.url));
    }
  }
});
