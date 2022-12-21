import { blocks, Prisma, PrismaClient } from '@prisma/client';
import debug from 'debug';
import { PubSub } from 'graphql-yoga';

const log: debug.Debugger = debug('graph:blocks');
const performanceLog: debug.Debugger = debug('performance');

class BlocksService {
  private _lastBlocks: blocks[] = [];
  private _prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  private _interval: NodeJS.Timer | undefined;
  public pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: blocks[]] }>;
  i: number = 0;

  public constructor(
    pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: blocks[]] }>,
    // eslint-disable-next-line @typescript-eslint/no-parameter-properties
    private mocks?: blocks[],
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
      this._lastBlocks = await this._prisma.blocks.findMany({
        orderBy: {
          id: 'desc',
        },
        include: {
          transactions: true,
        },
        take: 1,
      });
      log(
        'publish initial blocks',
        this._lastBlocks.map(
          ({ chainid, id, height }) => `${chainid}  ${height} ${id}`,
        ),
      );

      this.pubsub.publish('NEW_BLOCKS', this._lastBlocks);
    } else {
      performanceLog('before');

      const newBlocks = await this._prisma.blocks.findMany({
        where: {
          AND: [
            {
              id: {
                gt: this._lastBlocks[0].id,
              },
            },
            {
              hash: {
                not: this._lastBlocks[0].hash,
              },
            },
          ],
        },
        orderBy: {
          id: 'desc',
        },
        include: {
          transactions: true,
        },
      });

      performanceLog('after-response');

      if (newBlocks.length > 0) {
        log(
          'publish new blocks',
          newBlocks.map(
            ({ chainid, id, height }) => `${chainid}  ${height} ${id}`,
          ),
        );

        this._lastBlocks = newBlocks;
        this.pubsub.publish('NEW_BLOCKS', this._lastBlocks);

        performanceLog('after-publish');
      }
    }
  }
}

let blocksSingleton: BlocksService | undefined = undefined;

export function getBlocks(
  pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: blocks[]] }>,
  mocks?: blocks[],
): BlocksService {
  if (!blocksSingleton) {
    blocksSingleton = new BlocksService(pubsub, mocks);
  }

  return blocksSingleton;
}
