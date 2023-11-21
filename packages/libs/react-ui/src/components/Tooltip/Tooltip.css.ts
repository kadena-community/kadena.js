import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const base = style([
  sprinkles({
    position: 'absolute',
    backgroundColor: '$neutral6',
    fontSize: '$sm',
    paddingY: '$xs',
    paddingX: '$sm',
    borderRadius: '$md',
    color: '$neutral1',
    pointerEvents: 'none',
    width: 'max-content',
    maxWidth: '$maxContentWidth',
  }),
  {
    ':before': {
      content: '',
      position: 'absolute',
      borderTop: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderBottom: `6px solid ${vars.colors.$neutral6}`,
      borderLeft: '6px solid transparent',
    },
  },
]);

export const tooltipPositionVariants = styleVariants({
  bottom: [
    base,
    {
      marginTop: vars.sizes.$sm,
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
      marginBottom: vars.sizes.$sm,
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
      marginLeft: vars.sizes.$sm,
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
      marginRight: vars.sizes.$sm,
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
