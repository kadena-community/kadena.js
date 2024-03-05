import { prismaClient } from '@db/prisma-client';
import { COMPLEXITY } from '@services/complexity';
import { builder } from '../builder';
import GraphConfiguration from '../objects/graph-configuration';

const getLowestBlockHeigth = async (): Promise<bigint> => {
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

builder.queryField('graphConfiguration', (t) =>
  t.field({
    description: 'Get the configuration of the graph.',
    type: GraphConfiguration,
    complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
    async resolve() {
      return {
        minimumBlockHeight: await getLowestBlockHeigth(),
      };
    },
  }),
);
