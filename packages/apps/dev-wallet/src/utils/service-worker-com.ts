import {
  ServiceWorkerMessage,
  ServiceWorkerResponse,
} from '@/service-worker/types';

// Function to send a message to the Service Worker
export function sendMessageToServiceWorker(
  message: ServiceWorkerMessage,
): Promise<ServiceWorkerResponse> {
  return new Promise((resolve, reject) => {
    if (!navigator.serviceWorker.controller) {
      reject('No active service worker');
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => resolve(event.data);

    navigator.serviceWorker.controller.postMessage(message, [
      messageChannel.port2,
    ]);
  });
}
