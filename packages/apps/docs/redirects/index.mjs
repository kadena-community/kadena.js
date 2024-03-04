import { basicsPathUrlRedirects } from './paths/basics.mjs';
import { blogchainPathUrlRedirects } from './paths/blogchain.mjs';
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
  blogchainPathUrlRedirects,
].flat();

export { redirects };
