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
  registerServiceWorker();
  addBootTheme();
  import('./App/main').then(async ({ renderApp }) => {
    if (loadingContent) {
      loadingContent.innerHTML = '';
    }
    renderApp();
    globalThis.addEventListener('wallet-loaded', function () {
      document.getElementById('welcome-message')?.remove();
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

function registerServiceWorker() {
  if (loadingContent) {
    loadingContent.innerHTML = 'Loading Service Worker...';
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log(
          'Service Worker registered with scope:',
          registration.scope,
        );
        if (loadingContent) {
          loadingContent.innerHTML = 'Service Worker registered!';
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
            '<div>Service Worker registration failed!</div><div>using fallback mode</div><div>Loading UI...</div>';
        }
        console.error('Service Worker registration failed:', error);
      });
  }
}

bootstrap();
