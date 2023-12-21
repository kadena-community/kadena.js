import { responsiveStyle } from '@theme/themeUtils';
import { tokens } from '@theme/tokens/contract.css';
import { style } from '@vanilla-extract/css';

export const minWidth = style(
  responsiveStyle({
    xs: { minWidth: '100%' },
    sm: { minWidth: tokens.kda.foundation.layout.content.minWidth },
  }),
);
