import './objects/Account';
import './objects/Block';
import './objects/ChainAccount';
import './objects/FungibleBalance';
import './objects/Transaction';
import './objects/Transfer';
import './objects/Event';
import './Query/account';
import './Query/hello';
import './Query/completedBlockHeights';
import './Query/blocksFromHeight';
import './Query/lastBlockHeight';
import './Subscription/newBlocks';
import './Subscription/transaction';
import './Subscription/event';

import { builder } from './builder';

builder.queryType({});
// no mutation fields defined yet, hence commented
// builder.mutationType({});
builder.subscriptionType({});
