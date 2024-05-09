import { basicsPathUrlRedirects } from './paths/basics.mjs';
import { blogchainPathUrlRedirects } from './paths/blogchain.mjs';
import { buildPathUrlRedirects } from './paths/build.mjs';
import { contributePathUrlRedirects } from './paths/contribute.mjs';
import { kadenaPathUrlRedirects } from './paths/kadena.mjs';
import { marmaladePathUrlRedirects } from './paths/marmalade.mjs';
import { pactPathUrlRedirects } from './paths/pact.mjs';
import { rootPathUrlRedirects } from './paths/root.mjs';
import { tagsPathUrlRedirects } from './paths/tags.mjs';
import { version2PathUrlRedirects } from './paths/version2.mjs';

const redirects = [
  version2PathUrlRedirects,
  basicsPathUrlRedirects,
  contributePathUrlRedirects,
  marmaladePathUrlRedirects,
  buildPathUrlRedirects,
  kadenaPathUrlRedirects,
  pactPathUrlRedirects,
  rootPathUrlRedirects,
  blogchainPathUrlRedirects,
  tagsPathUrlRedirects,
].flat();

export { redirects };
