const getTheme = () => localStorage.getItem('theme') || 'dark';

// the entry file for the dev wallet app
// TODO: we need to do setup app here like service worker, etc
async function bootstrap() {
  import('./App/main').then(async ({ renderApp }) => {
    renderApp();
    globalThis.addEventListener('wallet-loaded', function () {
      document.getElementById('welcome-message')?.remove();
    });
  });
  // show welcome message if wallet is not loaded after 200ms
  setTimeout(() => {
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
      welcomeMessage.classList.add(`theme-${getTheme()}`);
      welcomeMessage.style.opacity = '1';
    }
  }, 200);
}

bootstrap();
