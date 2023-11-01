import { prismaClient } from '../../db/prismaClient';
import { dotenv } from '../../utils/dotenv';
import { builder } from '../builder';

builder.queryField('graphAndChainwebData', (t) => {
  return t.field({
    type: 'GraphAndChainwebData',
    resolve: async () => {
      return {
        maximumConfirmationDepth: dotenv.MAX_BLOCK_DEPTH,
        minimumBlockHeight: await getMinimumBlockHeight(),
      };
    },
  });
});

const getMinimumBlockHeight = async (): Promise<bigint> => {
  const lowestBlock = await prismaClient.block.findFirst({
    orderBy: {
      height: 'asc',
    },
    select: {
      height: true,
    },
  });

  return lowestBlock?.height || BigInt(0);
};
