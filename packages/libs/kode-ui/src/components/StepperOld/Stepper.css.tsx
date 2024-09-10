import { token } from '../../styles';
import { style } from '../../styles/utils';

export const stepper = style({});

export const step = style({
  display: 'flex',
  position: 'relative',
  paddingBlock: token('spacing.md'),
  color: token('color.text.brand.primary.default'),
  selectors: {
    '&:before': {
      content: '',
      position: 'absolute',
      backgroundColor: token('color.background.accent.primary.inverse.default'),
      borderRadius: token('radius.round'),
      height: token('size.n2'),
      width: token('size.n2'),
      transform: 'translateX(-50%)',
    },
    '&:first-child:after': {
      height: '50%',
      transform: 'translateY(50%) translateX(-50%)',
    },
    '&:last-child:after': {
      height: '50%',
      transform: 'translateY(-50%) translateX(-50%)',
    },
    '&:after': {
      content: '',
      position: 'absolute',
      backgroundColor: token('color.background.accent.primary.inverse.default'),
      height: '100%',
      width: '1px',
      transform: 'translateX(-50%)',
    },
    '&[data-active="true"]:before': {
      height: token('size.n4'),
      width: token('size.n4'),
    },
    '&[data-active="true"] ~ &': {
      color: token('color.text.gray.default'),
    },
    '&[data-active="true"] ~ &:before': {
      backgroundColor: token('color.icon.brand.primary.@disabled'),
    },
    '&[data-active="true"] ~ &:after': {
      backgroundColor: token('color.icon.brand.primary.@disabled'),
    },
  },
});

export const check = style({
  selectors: {
    [`${step}[data-active="true"] &`]: {
      display: 'none',
    },
    [`${step}[data-active="true"] ~ ${step} &`]: {
      display: 'none',
    },
  },
});
