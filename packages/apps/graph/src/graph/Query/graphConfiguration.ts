import { prismaClient } from '@db/prismaClient';
import { dotenv } from '@utils/dotenv';
import { builder } from '../builder';
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

builder.queryField('graphConfiguration', (t) => {
  return t.field({
    type: 'GraphConfiguration',
    async resolve() {
      return {
        maximumConfirmationDepth:
          dotenv.MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH,
        minimumBlockHeight: await getMinimumBlockHeight(),
      };
    },
  });
});
