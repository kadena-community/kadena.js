import { PrismaClient, Prisma, blocks } from '@prisma/client';

class Blocks {
  lastBlocks: blocks[] = [];
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async getLatestBlocks(): Promise<blocks[]> {
    if (this.lastBlocks.length === 0) {
      this.lastBlocks = await this.prisma.blocks.findMany({
        orderBy: {
          creationtime: 'desc',
        },
        take: 10,
      });
      return this.lastBlocks;
    } else {
      this.lastBlocks = await this.prisma.blocks.findMany({
        where: {
          creationtime: {
            gt: this.lastBlocks[0].creationtime,
          },
        },
        orderBy: {
          creationtime: 'desc',
        },
      });
      return this.lastBlocks;
    }
  }
}

const blocksSingleton = new Blocks();

export type BlocksSingleton = typeof blocksSingleton;

export function getBlocks() {
  return blocksSingleton;
}
