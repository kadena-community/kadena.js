import type { Block, Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import _debug from 'debug';
import type { PubSub } from 'graphql-yoga';

const log: _debug.Debugger = _debug('graph:blocks');
const performanceLog: _debug.Debugger = _debug('performance');
class BlocksService {
  private _lastBlocks: Block[] = [];
  private _prisma: PrismaClient<Prisma.PrismaClientOptions, never>;
  private _interval: NodeJS.Timer | undefined;
  public pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: Block[]] }>;
  private _i: number = 0;
  private _mocks: Block[];

  public constructor(
    pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: Block[]] }>,
    // eslint-disable-next-line @typescript-eslint/no-parameter-properties
    mocks?: Block[],
  ) {
    this._prisma = new PrismaClient();
    this._mocks = mocks || [];
    this.pubsub = pubsub;
    this.start();
  }

  public start(): void {
    log('start');
    if (this._interval) {
      clearInterval(this._interval);
    }
    this._interval = setInterval(() => this.getLatestBlocks(), 1000);
  }

  public stop(): void {
    log('stop');
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  public async getLatestBlocks(): Promise<void> {
    log('getLatestBlocks');
    if (this._mocks.length > 0) {
      if (this._i % 10 === 0) {
        console.log('publish 2 block');
        this.pubsub.publish('NEW_BLOCKS', [
          this._mocks[this._i],
          this._mocks[this._i + 1],
        ]);
        this._i += 2;
      } else {
        console.log('publish 1 block');
        this.pubsub.publish('NEW_BLOCKS', [this._mocks[this._i]]);
        this._i++;
      }
      return;
    }

    if (this._lastBlocks.length === 0) {
      this._lastBlocks = await this._prisma.block.findMany({
        orderBy: { id: 'desc' },
        include: {
          // TODO: fix transactions
          // transactions: true,
        },
      });
      this.pubsub.publish('NEW_BLOCKS', this._lastBlocks);
    } else if (this._lastBlocks[0] !== null) {
      performanceLog('before');

      const newBlocks = await this._prisma.block.findMany({
        where: { id: { gt: this._lastBlocks[0].id } },
        orderBy: { id: 'desc' },
        include: {
          // TODO: fix transactions
          // transactions: true,
        },
      });

      performanceLog('after-response');

      if (newBlocks.length > 0) {
        this._lastBlocks = newBlocks;
        this.pubsub.publish('NEW_BLOCKS', this._lastBlocks);

        performanceLog('after-publish');
      }
    }
  }
}

let blocksSingleton: BlocksService | undefined = undefined;

export function getBlocks(
  pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: Block[]] }>,
  mocks?: Block[],
): BlocksService {
  if (!blocksSingleton) {
    blocksSingleton = new BlocksService(pubsub, mocks);
  }

  return blocksSingleton;
}
