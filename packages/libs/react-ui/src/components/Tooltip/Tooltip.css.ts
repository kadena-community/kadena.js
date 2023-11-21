import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const base = style([
  sprinkles({
    position: 'absolute',
    backgroundColor: '$neutral1',
    padding: '$sm',
    borderRadius: '$md',
    color: '$neutral6',
    pointerEvents: 'none',
    width: 'max-content',
    maxWidth: '$maxContentWidth',
  }),
  {
    ':before': {
      content: '',
      position: 'absolute',
      borderTop: '0.5rem solid transparent',
      borderRight: '0.5rem solid transparent',
      borderBottom: `0.5rem solid ${vars.colors.$neutral1}`,
      borderLeft: '0.5rem solid transparent',
    },
  },
]);

export const tooltipPositionVariants = styleVariants({
  bottom: [
    base,
    {
      marginTop: vars.sizes.$md,
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      ':before': {
        top: '0',
        left: '50%',
        transform: 'translate(-50%, -100%)',
      },
    },
  ],
  top: [
    base,
    {
      marginBottom: vars.sizes.$md,
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      ':before': {
        bottom: '0',
        left: '50%',
        transform: 'translate(-50%, 100%) rotate(180deg)',
      },
    },
  ],
  right: [
    base,
    {
      marginLeft: vars.sizes.$md,
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      ':before': {
        top: '50%',
        left: '0',
        transform: 'translate(-100%, -50%) rotate(270deg)',
      },
    },
  ],
  left: [
    base,
    {
      marginRight: vars.sizes.$md,
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      ':before': {
        top: '50%',
        right: '0',
        transform: 'translate(100%, -50%) rotate(90deg)',
      },
    },
  ],
});
