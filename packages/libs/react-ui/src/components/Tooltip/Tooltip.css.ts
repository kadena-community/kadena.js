import { style, styleVariants } from '@vanilla-extract/css';
import { atoms } from '../../styles/atoms.css';
import { tokens } from '../../styles/index';

export const base = style([
  atoms({
    position: 'absolute',
    fontSize: 'sm',
    paddingBlock: 'sm',
    paddingInline: 'md',
    borderRadius: 'md',
    color: 'text.base.inverse.default',
    pointerEvents: 'none',
    backgroundColor: 'base.inverse.default',
    maxWidth: 'content.maxWidth',
  }),
  {
    width: 'max-content',
    ':before': {
      content: '',
      position: 'absolute',
      borderTop: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderBottom: `6px solid ${tokens.kda.foundation.color.border.base.default}`,
      borderLeft: '6px solid transparent',
    },
    zIndex: tokens.kda.foundation.zIndex.overlay,
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
