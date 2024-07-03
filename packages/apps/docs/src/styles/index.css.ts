import { responsiveStyle, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const browseSectionWrapper = style([
  {
    marginBlockEnd: tokens.kda.foundation.spacing.lg,
    flexBasis: '50%',
    rowGap: tokens.kda.foundation.spacing.md,

    ...responsiveStyle({ md: { flexBasis: '33%' } }),
  },
]);

export const extraMarginWrapper = style({
  marginBlockStart: tokens.kda.foundation.size.n8,
  ...responsiveStyle({
    sm: { marginInlineEnd: 0 },
    xl: { marginInlineEnd: tokens.kda.foundation.size.n32 },
  }),
});

export const extraMarginSmallWrapper = style({
  marginBlockStart: tokens.kda.foundation.size.n8,
  marginBlockEnd: tokens.kda.foundation.size.n20,
});
export const marmaladeWrapperClass = style({
  ...responsiveStyle({
    sm: {
      marginInlineEnd: 0,
    },
    lg: {
      marginInlineEnd: tokens.kda.foundation.size.n32,
    },
    xl: {
      marginInlineEnd: tokens.kda.foundation.size.n64,
    },
  }),
});
