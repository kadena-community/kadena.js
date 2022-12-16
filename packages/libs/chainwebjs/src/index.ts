import ResponseError from './ResponseError';
import * as cut from './cut';
import * as header from './headers';
import * as block from './blocks';
import * as transaction from './transactions';
import * as event from './events';
import * as internal from './internal';

export default {
  ResponseError: ResponseError,
  cut: {
    current: cut.currentCut,
    peers: cut.cutPeers,
  },
  header: {
    range: header.headers,
    recent: header.recentHeaders,
    stream: header.headerStream,
    height: header.headerByHeight,
    blockHash: header.headerByBlockHash,
  },
  block: {
    range: block.blocks,
    recent: block.recentBlocks,
    stream: block.blockStream,
    height: block.blockByHeight,
    blockHash: block.blockByBlockHash,
  },
  transaction: {
    range: transaction.txs,
    recent: transaction.recentTxs,
    stream: transaction.txStream,
    height: transaction.txsByHeight,
    blockHash: transaction.txsByBlockHash,
  },
  event: {
    range: event.events,
    recent: event.recentEvents,
    stream: event.eventStream,
    height: event.eventsByHeight,
    blockHash: event.eventsByBlockHash,
  },
  interal: {
    branchPage: internal.branchPage,
    branch: internal.branch,
    currentBranch: internal.currentBranch,
    payloads: internal.payloads,
    cutPeerPage: internal.cutPeerPage,
  },
};
