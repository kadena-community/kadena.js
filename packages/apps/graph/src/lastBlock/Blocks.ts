import { blocks, Prisma, PrismaClient } from '@prisma/client';
import debug from 'debug';
import { PubSub } from 'graphql-yoga';

const log = debug('graph:blocks');

class Blocks {
  private _lastBlocks: blocks[] = [];
  private _prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  private _interval: NodeJS.Timer | undefined;

  constructor(private pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: blocks[]] }>) {
    this._prisma = new PrismaClient();
    this.start();
  }

  start() {
    if (this._interval) {
      clearInterval(this._interval);
    }
    this._interval = setInterval(() => this.getLatestBlocks(), 1000);
  }

  stop() {
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
      }
    }
  }
}

let blocksSingleton: Blocks | undefined = undefined;
export function getBlocks(
  pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: blocks[]] }>,
) {
  if (!blocksSingleton) {
    blocksSingleton = new Blocks(pubsub);
  }

  return blocksSingleton;
}
