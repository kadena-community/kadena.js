// the entry file for the dev wallet app
// TODO: we need to do setup app here like service worker, etc
function bootstrap() {
  import('./App/main').then(({ renderApp }) => renderApp());
}

bootstrap();
