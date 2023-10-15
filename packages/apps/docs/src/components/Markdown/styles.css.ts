import { sprinkles, vars } from '@kadena/react-ui/theme';

import { treeListClass } from '../Layout/components/TreeMenu/styles.css';

import { headerClass } from './Heading/styles.css';
import { paragraphWrapperClass } from './Paragraph/styles.css';
import { ulListClass } from './UnorderedList/styles.css';

import { getClassName } from '@/utils/getClassName';
import { globalStyle, style } from '@vanilla-extract/css';

export const wrapperClass = style([
  sprinkles({
    marginY: '$5',
    marginX: 0,
  }),
  {},
]);
