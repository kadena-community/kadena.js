import {
  atoms,
  recipe,
  responsiveStyle,
  token,
  tokens,
} from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const searchWrapperVariants = recipe({
  variants: {
    variant: {
      default: {},
      full: {
        paddingInline: token('spacing.lg'),
      },
    },
  },
});
export const searchWrapperClass = style([
  atoms({
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 'lg',
  }),
  {
    gridTemplateRows: 'auto',
    gridTemplateColumns: '100%',
  },
  responsiveStyle({
    md: {
      gap: 'unset',
      justifyContent: 'unset',
      gridTemplateRows: 'auto',
      gridTemplateColumns: 'clamp(200px, 25%, 256px) auto',
    },
  }),
]);

export const layoutVariants = recipe({
  variants: {
    variant: {
      default: {
        rowGap: tokens.kda.foundation.spacing.lg,
        gridTemplateAreas: `
        'header header'
        'aside aside'
        'body  body'
        `,
        ...responsiveStyle({
          md: {
            rowGap: 0,
            columnGap: tokens.kda.foundation.spacing.sm,
            gridTemplateAreas: `
                'header header'
                'aside  body'
                `,
          },
        }),
      },
      full: {
        gridTemplateAreas: `
                        'header header'
                        'body  body'
                        `,
      },
    },
  },
});
export const mainClass = style([
  atoms({
    display: 'grid',
  }),
  {
    gridTemplateRows: 'auto',
    gridTemplateColumns: 'clamp(150px, 24%, 256px) auto',
  },
]);

export const bodyClass = style({
  gridArea: 'body',
});

export const asideClass = style([
  atoms({
    flexDirection: 'column',
    gap: 'sm',
  }),
  {
    gridArea: 'aside',
  },
]);
export const headerClass = style({
  gridArea: 'header',
});

export const cardClass = style({});

globalStyle(`${cardClass}`, {
  padding: tokens.kda.foundation.spacing.md,
  alignSelf: 'flex-start',
});

globalStyle(`${cardClass} canvas`, {
  width: '100%!important',
  height: 'auto!important',
  aspectRatio: '1/1',
});
