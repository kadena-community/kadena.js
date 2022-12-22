import {
  Block,
  BlockSequence,
  Prisma,
  PrismaClient,
  Transaction,
} from '@prisma/client';
import debug from 'debug';
import { PubSub } from 'graphql-yoga';

const log: debug.Debugger = debug('graph:blocks');
const performanceLog: debug.Debugger = debug('performance');

export interface ILastBlock {
  blocks_sequence: BlockSequence | null;
  transactions: Transaction[];
}

class BlocksService {
  private _lastBlocks: ILastBlock[] = [];
  private _prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  private _interval: NodeJS.Timer | undefined;
  public pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: ILastBlock[]] }>;
  i: number = 0;

  public constructor(
    pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: ILastBlock[]] }>,
    // eslint-disable-next-line @typescript-eslint/no-parameter-properties
    private mocks?: ILastBlock[],
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
      this._lastBlocks = (
        await this._prisma.blockSequence.findMany({
          orderBy: { id: 'desc' },
          include: {
            blocks: {
              include: {
                blocks_sequence: true,
                transactions: true,
              },
            },
          },
        })
      ).flatMap((blocksSequence) => {
        return blocksSequence.blocks;
      });

      this.pubsub.publish('NEW_BLOCKS', this._lastBlocks);
    } else if (this._lastBlocks[0].blocks_sequence !== null) {
      performanceLog('before');
      console.log('last block id: ', this._lastBlocks[0]);
      console.log(this._lastBlocks[0].blocks_sequence.id);

      const newBlocks = (
        await this._prisma.blockSequence.findMany({
          where: { id: { gt: this._lastBlocks[0].blocks_sequence.id } },
          orderBy: { id: 'desc' },
          include: {
            blocks: {
              include: {
                transactions: true,
                blocks_sequence: true,
              },
            },
          },
        })
      ).flatMap((blocksSequence) => {
        return blocksSequence.blocks!;
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
  mocks?: ILastBlock[],
): BlocksService {
  if (!blocksSingleton) {
    blocksSingleton = new BlocksService(pubsub, mocks);
  }

  return blocksSingleton;
}
