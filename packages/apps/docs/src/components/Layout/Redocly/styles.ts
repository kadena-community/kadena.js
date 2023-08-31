import { styled, StyledComponent } from '@kadena/react-components';

import { BasePageGrid } from '../components';
import { BaseBackground } from '../Full/components/Aside/AsideStyles';

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
