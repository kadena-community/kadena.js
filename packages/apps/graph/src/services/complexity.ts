import { PRISMA } from '../graph/builder';

export const COMPLEXITY = {
  FIELD: {
    DEFAULT: 1,
    CHAINWEB_NODE: 7,
    PRISMA_WITHOUT_RELATIONS: 5,
    PRISMA_WITH_RELATIONS: 10,
  },
  MULTIPLIER: {
    DEFAULT: 1,
  },
};

export const getDefaultConnectionComplexity = (options?: {
  withRelations?: boolean;
  first?: number | null;
  last?: number | null;
  minimumDepth?: number | null;
}): number => {
  let baseComplexity = options?.withRelations
    ? COMPLEXITY.FIELD.PRISMA_WITH_RELATIONS
    : COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS;

  // If minimumDepth is provided, increase the complexity
  if (options?.minimumDepth) {
    // The maximum calculated depth is 6
    const confirmationDepthMultiplier =
      options.minimumDepth > 6 ? 6 : options.minimumDepth;

    baseComplexity +=
      COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS * confirmationDepthMultiplier;
  }

  return (
    baseComplexity * (options?.first || options?.last || PRISMA.DEFAULT_SIZE)
  );
};
