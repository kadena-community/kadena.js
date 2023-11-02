import { dotenv } from '@src/utils/dotenv';
import { builder } from '../builder';

builder.queryField('maximumConfirmationDepth', (t) => {
  return t.field({
    type: 'Int',
    nullable: false,
    async resolve() {
      return dotenv.MAX_BLOCK_DEPTH;
    },
  });
});
