import { atoms, recipe } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const layoutVariants = recipe({
  variants: {
    variant: {
      default: {
        gridTemplateAreas: `
                'header header'
                'aside  body'
                `,
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
    gridTemplateColumns: 'clamp(200px, 25%, 256px) auto',
  },
]);

export const bodyClass = style({
  gridArea: 'body',
});

export const asideClass = style({
  gridArea: 'aside',
});
export const headerClass = style({
  gridArea: 'header',
});
