import './objects/ModuleAccount';
import './objects/Block';
import './objects/ChainModuleAccount';
import './objects/Guard';
import './objects/Transaction';
import './objects/Transfer';
import './objects/Event';
import './objects/Minerkey';
import './Query/hello';
import './Query/completedBlockHeights';
import './Query/account';
import './Query/blocksFromHeight';
import './Query/chainAccount';
import './Query/completedBlockHeights';
import './Query/lastBlockHeight';
import './Query/block';
import './Query/transactions';
import './Query/transfers';
import './Subscription/newBlocks';
import './Subscription/transaction';
import './Subscription/event';

import { builder } from './builder';

builder.queryType({});
// no mutation fields defined yet, hence commented
// builder.mutationType({});
builder.subscriptionType({});
