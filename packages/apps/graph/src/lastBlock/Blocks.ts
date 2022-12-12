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

  public constructor(pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: blocks[]] }>) {
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
    if (this._lastBlocks.length === 0) {
      this._lastBlocks = await this._prisma.blocks.findMany({
        orderBy: {
          creationtime: 'desc',
        },
        take: 1,
      });
      log(
        'publish initial blocks',
        this._lastBlocks.map(
          ({ chainid, creationtime, height }) =>
            `${chainid}  ${height} ${creationtime}`,
        ),
      );

      this.pubsub.publish('NEW_BLOCKS', this._lastBlocks);
    } else {
      performanceLog('before');

      const newBlocks = await this._prisma.blocks.findMany({
        where: {
          AND: [
            {
              creationtime: {
                gt: this._lastBlocks[0].creationtime,
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
          creationtime: 'desc',
        },
      });

      performanceLog('after-response');

      if (newBlocks.length > 0) {
        log(
          'publish new blocks',
          newBlocks.map(
            ({ chainid, creationtime, height }) =>
              `${chainid}  ${height} ${creationtime}`,
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
): BlocksService {
  if (!blocksSingleton) {
    blocksSingleton = new BlocksService(pubsub);
  }

  return blocksSingleton;
}
