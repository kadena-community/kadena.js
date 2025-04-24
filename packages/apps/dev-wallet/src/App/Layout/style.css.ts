import { atoms, globalStyle, recipe, token } from '@kadena/kode-ui/styles';
import { createVar, style } from '@vanilla-extract/css';

const contentWidth = createVar();

export const isNotExpandedClass = style({
  vars: {
    [contentWidth]: 'calc(100vw - 45px)',
  },
});

export const isExpandedMainClass = style({
  vars: {
    [contentWidth]: 'min(1200px, calc(100vw - 232px))',
  },
});

export const mainContainerClass = style({
  display: 'flex',
  padding: '0 10px',
  flexDirection: 'column',
  maxWidth: '100vw',
  width: '100%',
  minHeight: 'calc(100vh - 120px)',
  '@media': {
    'screen and (min-width: 768px)': {
      maxWidth: contentWidth,
      minHeight: 'calc(100vh - 60px)',
    },
  },
});

export const topBannerClass = style([
  atoms({
    marginBlockEnd: 'md',
  }),
  {
    minHeight: 'unset!important',
  },
]);

export const mobileNetworkClass = style({
  display: 'flex',
  '@media': {
    'screen and (min-width: 640px)': {
      display: 'none',
    },
  },
});

export const logoClass = style({
  color: token('color.text.brand.wordmark.default'),
  height: '32px',
  minHeight: '32px',
});

export const sidebarButtongroupClass = recipe({
  base: {},
  variants: {
    isExpanded: {
      true: { width: '100%' },
      false: {},
    },
  },
});

globalStyle(`[class*="isExpanded_false"] > [class*="ButtonGroup"]`, {
  flexDirection: 'column',
  alignItems: 'center',
});

globalStyle(`[class*="isExpanded_true"] > [class*="ButtonGroup"]`, {
  flex: 1,
});
