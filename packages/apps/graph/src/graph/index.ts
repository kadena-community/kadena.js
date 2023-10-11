import './objects/Block';
import './objects/Transaction';
import './objects/Event';
import './objects/Minerkey';
import './Query/hello';
import './Query/completedBlockHeights';
import './Query/blocksFromHeight';
import './Query/lastBlockHeight';
import './Query/block';
import './Subscription/newBlocks';
import './Subscription/transaction';
import './Subscription/event';

import { builder } from './builder';

builder.queryType({});
// no mutation fields defined yet, hence commented
// builder.mutationType({});
builder.subscriptionType({});
