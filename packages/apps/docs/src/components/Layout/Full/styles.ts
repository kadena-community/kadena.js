import { styled, StyledComponent } from '@kadena/react-components';

import { BasePageGrid } from '../components/styles';

export const PageGrid: StyledComponent<typeof BasePageGrid> = styled(
  BasePageGrid,
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
