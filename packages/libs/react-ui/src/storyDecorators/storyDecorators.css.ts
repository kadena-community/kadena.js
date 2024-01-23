import { style } from '@vanilla-extract/css';
import { responsiveStyle, tokens } from '../styles';

export const minWidth = style(
  responsiveStyle({
    xs: { minWidth: '100%' },
    sm: { minWidth: tokens.kda.foundation.layout.content.minWidth },
  }),
);
