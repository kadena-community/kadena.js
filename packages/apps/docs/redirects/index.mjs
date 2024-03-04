import { basicsPathUrlRedirects } from './paths/basics.mjs';
import { buildPathUrlRedirects } from './paths/build.mjs';
import { kadenaPathUrlRedirects } from './paths/kadena.mjs';
import { pactPathUrlRedirects } from './paths/pact.mjs';
import { rootPathUrlRedirects } from './paths/root.mjs';

const redirects = [
  basicsPathUrlRedirects,
  buildPathUrlRedirects,
  kadenaPathUrlRedirects,
  pactPathUrlRedirects,
  rootPathUrlRedirects,
].flat();

export { redirects };
