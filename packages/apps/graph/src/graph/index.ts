import './objects/Block';
import './objects/Transaction';
import './Query/hello';
import './Query/completedBlockHeights';
import './Query/blocksFromHeight';
import './Query/lastBlockHeight';
import './Subscription/newBlocks';
import './Subscription/transaction';

import { builder } from './builder';

builder.queryType({});
// no mutation fields defined yet, hence commented
// builder.mutationType({});
builder.subscriptionType({});
