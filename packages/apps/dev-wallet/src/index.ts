const getTheme = () => localStorage.getItem('theme') || 'dark';
const addBootTheme = () => {
  document.body.classList.add(`boot-theme-${getTheme()}`);
};
const removeBootTheme = () => {
  document.body.classList.remove(`boot`);
  document.body.classList.remove(`boot-theme-${getTheme()}`);
};

// the entry file for the dev wallet app
// TODO: we need to do setup app here like service worker, etc
async function bootstrap() {
  addBootTheme();
  import('./App/main').then(async ({ renderApp }) => {
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

bootstrap();
