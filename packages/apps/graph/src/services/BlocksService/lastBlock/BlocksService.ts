import { Block, Prisma, PrismaClient } from '@prisma/client';
import debug from 'debug';
import { PubSub } from 'graphql-yoga';

const log: debug.Debugger = debug('graph:blocks');
const performanceLog: debug.Debugger = debug('performance');
class BlocksService {
  private _lastBlocks: Block[] = [];
  private _prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  private _interval: NodeJS.Timer | undefined;
  public pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: Block[]] }>;
  i: number = 0;

  public constructor(
    pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: Block[]] }>,
    // eslint-disable-next-line @typescript-eslint/no-parameter-properties
    private mocks?: Block[],
  ) {
    this._prisma = new PrismaClient();
    this.pubsub = pubsub;
    this.start();
  }

  public start(): void {
    if (this._interval) {
      clearInterval(this._interval);
    }
    this._interval = setInterval(() => this.getLatestBlocks(), 1000);
  }

  public stop(): void {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  public async getLatestBlocks(): Promise<void> {
    if (this.mocks) {
      if (this.i % 10 === 0) {
        console.log('publish 2 block');
        this.pubsub.publish('NEW_BLOCKS', [
          this.mocks[this.i],
          this.mocks[this.i + 1],
        ]);
        this.i += 2;
      } else {
        console.log('publish 1 block');
        this.pubsub.publish('NEW_BLOCKS', [this.mocks[this.i]]);
        this.i++;
      }
      return;
    }

    if (this._lastBlocks.length === 0) {
      this._lastBlocks = await this._prisma.block.findMany({
        orderBy: { id: 'desc' },
        include: {
          transactions: true,
        },
      });
      this.pubsub.publish('NEW_BLOCKS', this._lastBlocks);
    } else if (this._lastBlocks[0] !== null) {
      performanceLog('before');

      const newBlocks = await this._prisma.block.findMany({
        where: { id: { gt: this._lastBlocks[0].id } },
        orderBy: { id: 'desc' },
        include: {
          transactions: true,
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
