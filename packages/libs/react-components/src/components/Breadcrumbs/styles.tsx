import { styled } from '../../styles';

import { StyledComponent } from '@stitches/react/types/styled-component';

export const StyledBreadcrumbs: StyledComponent<'ul'> = styled('ul', {
  display: 'flex',
  padding: 0,
  listStyle: 'none',
});

export const StyledBreadcrumbItem: StyledComponent<
  'li',
  { first?: boolean | 'true' | 'false' }
> = styled('li', {
  padding: 0,

  a: {
    color: '$neutral4',
    textDecoration: 'none',
  },

  variants: {
    first: {
      true: {
        fontWeight: '$bold',
      },
      false: {},
    },
  },
});
