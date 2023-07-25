import { styled, StyledComponent } from '@kadena/react-components';

import { BaseTemplate } from '../components';

export const Template: StyledComponent<typeof BaseTemplate> = styled(
  BaseTemplate,
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
