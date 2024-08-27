import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ event }) => event.request.destination === 'image',
  ({ event }) => caches.open('images').then((cache) => cache.match(event.request)),
);