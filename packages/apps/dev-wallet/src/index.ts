const getTheme = () => localStorage.getItem('theme') || 'dark';
const addBootTheme = () => {
  document.body.classList.add(`boot-theme-${getTheme()}`);
};
const removeBootTheme = () => {
  document.body.classList.remove(`boot`);
  document.body.classList.remove(`boot-theme-${getTheme()}`);
};

const loadingContent = document.getElementById('loading-content');

// the entry file for the dev wallet app
// TODO: we need to do setup app here like service worker, etc
async function bootstrap() {
  const mainModule = import('./App/main');
  await registerServiceWorker();
  addBootTheme();
  mainModule.then(async ({ renderApp }) => {
    if (loadingContent) {
      loadingContent.innerHTML = '';
    }
    renderApp();
    globalThis.addEventListener('wallet-loaded', function () {
      const welcomeMessage = document.getElementById('welcome-message');
      if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
      }
      removeBootTheme();
    });
  });
  // show welcome message if wallet is not loaded after 200ms
  setTimeout(() => {
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
      welcomeMessage.style.opacity = '1';
    }
  }, 200);
}

async function registerServiceWorker() {
  if (loadingContent) {
    loadingContent.innerHTML = 'Loading Service Worker...';
  }
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker
      .register('/assets/sw.js')
      .then((registration) => {
        console.log(
          'Service Worker registered with scope:',
          registration.scope,
        );
        if (loadingContent) {
          loadingContent.innerHTML =
            '<div>Service Worker registered!</div><div>Loading components...</div>';
        }
        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.onstatechange = () => {
            if (newWorker.state === 'activated') {
              // If the service worker is activated, reload the page
              window.location.reload();
            }
          };
        };
      })
      .catch((error) => {
        if (loadingContent) {
          loadingContent.innerHTML =
            '<div>Service Worker registration failed!</div><div>using fallback mode</div><div>Loading components...</div>';
        }
        console.error('Service Worker registration failed:', error);
      });
  }
}

bootstrap();
