import { sprinkles } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const treeWrapperClass = style([
  sprinkles({
    color: '$foreground',
  }),
]);

export const treeTitleClassWrapper = style([
  sprinkles({
    display: 'flex',
  }),
]);

export const treeTitleClass = style([
  sprinkles({
    marginLeft: '$1',
  }),
]);
export const treeTitleVariant = styleVariants({
  isParent: [
    sprinkles({
      fontSize: '$base',
    }),
  ],
  isChild: [
    sprinkles({
      fontSize: '$sm',
    }),
  ],
});

export const treeToggleClass = style([
  {
    border: 'none',
    background: 'none',
    outline: 'none',
  },
]);
export const treeToggleVariant = styleVariants({
  opened: [{ transform: 'rotate(0deg)' }],
  closed: [{ transform: 'rotate(-90deg)' }],
});

export const treeBranchWrapperVariant = styleVariants({
  isParent: [
    sprinkles({
      marginLeft: 0,
    }),
  ],
  isChild: [
    sprinkles({
      marginLeft: '$4',
    }),
  ],
});
