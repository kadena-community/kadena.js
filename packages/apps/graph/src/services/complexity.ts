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
}) =>
  (options?.withRelations
    ? COMPLEXITY.FIELD.PRISMA_WITH_RELATIONS
    : COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS) *
  (options?.first || options?.last || PRISMA.DEFAULT_SIZE);
