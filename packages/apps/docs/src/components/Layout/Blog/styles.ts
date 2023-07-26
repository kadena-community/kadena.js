import { styled, StyledComponent } from '@kadena/react-components';

import { BasePageGrid } from '../components';

export const PageGrid: StyledComponent<typeof BasePageGrid> = styled(
  BasePageGrid,
  {
    gridTemplateColumns: 'auto auto',
    gridTemplateAreas: `
            "header header"
            "pageheader pageheader"
            "content content"
            "footer footer"
          `,

    '@md': {
      gridTemplateColumns:
        '1% $leftSideWidth minmax(auto, calc($pageWidth - $leftSideWidth)) 1%',

      gridTemplateAreas: `
              "header header header header"
              "pageheader pageheader pageheader pageheader"
              ". menu content ."
              "footer footer footer footer"
            `,
    },
    '@2xl': {
      gridTemplateColumns:
        'minmax(1%, auto) $leftSideWidth minmax(auto, calc($pageWidth - $leftSideWidth)) minmax(1%, auto)',
    },
  },
);

// BottomBlogSection

export const BottomWrapper: StyledComponent<
  'div',
  { layout?: 'code' | 'default' }
> = styled('div', {
  width: '100%',

  defaultVariants: {
    layout: 'default',
  },
  variants: {
    layout: {
      default: {},
      code: {
        '@xl': {
          width: '56%',
        },
        '@2xl': {
          width: '60%',
        },
      },
    },
  },
});
