import { atoms } from '@theme/atoms.css';
import { tokens } from '@theme/index';
import { style, styleVariants } from '@vanilla-extract/css';

export const base = style([
  atoms({
    position: 'absolute',
    backgroundColor: 'layer-3.default',
    fontSize: 'sm',
    paddingY: 'sm',
    paddingX: 'md',
    borderRadius: 'md',
    color: 'text.base.default',
    pointerEvents: 'none',
    maxWidth: 'content.maxWidth',
  }),
  {
    width: 'max-content',
    ':before': {
      content: '',
      position: 'absolute',
      borderTop: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderBottom: `6px solid ${tokens.kda.foundation.color.background['layer-3'].default}`,
      borderLeft: '6px solid transparent',
    },
  },
]);

export const tooltipPositionVariants = styleVariants({
  bottom: [
    base,
    {
      marginTop: tokens.kda.foundation.spacing.md,
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
      marginBottom: tokens.kda.foundation.spacing.md,
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
      marginLeft: tokens.kda.foundation.spacing.md,
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
      marginRight: tokens.kda.foundation.spacing.md,
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
