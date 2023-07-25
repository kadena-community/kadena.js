import { styled, StyledComponent } from '@kadena/react-components';

import { BaseTemplate } from '../components';

export const Template: StyledComponent<typeof BaseTemplate> = styled(
  BaseTemplate,
  {
    '@md': {
      gridTemplateColumns:
        '1% $leftSideWidth minmax(auto, calc($pageWidth - $leftSideWidth - $$asideMenuWidthMDDefault)) $$asideMenuWidthMDDefault 1%',
    },
    '@2xl': {
      gridTemplateColumns:
        'auto $leftSideWidth minmax(auto, calc($pageWidth - $leftSideWidth - $$asideMenuWidthLGDefault)) $$asideMenuWidthLGDefault auto',
    },
  },
);
