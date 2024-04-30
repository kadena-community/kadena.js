import { basicsPathUrlRedirects } from './paths/basics.mjs';
import { blogchainPathUrlRedirects } from './paths/blogchain.mjs';
import { buildPathUrlRedirects } from './paths/build.mjs';
import { contributePathUrlRedirects } from './paths/contribute.mjs';
import { kadenaPathUrlRedirects } from './paths/kadena.mjs';
import { marmaladePathUrlRedirects } from './paths/marmalade.mjs';
import { pactPathUrlRedirects } from './paths/pact.mjs';
import { rootPathUrlRedirects } from './paths/root.mjs';
import { tagsPathUrlRedirects } from './paths/tags.mjs';

const redirects = [
  basicsPathUrlRedirects,
  blogchainPathUrlRedirects,
  buildPathUrlRedirects,
  contributePathUrlRedirects,
  kadenaPathUrlRedirects,
  marmaladePathUrlRedirects,
  pactPathUrlRedirects,
  rootPathUrlRedirects,
  tagsPathUrlRedirects,
].flat();

export { redirects };
