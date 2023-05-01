import { styled } from '../../styles';

import { StyledComponent } from '@stitches/react/types/styled-component';

export const StyledBreadcrumbs: StyledComponent<'ul'> = styled('ul', {
  display: 'flex',
  flexFlow: 'wrap',
  padding: 0,
  listStyle: 'none',
});

export const StyledBreadcrumbItem: StyledComponent<'li'> = styled('li', {
  padding: 0,
  color: '$neutral4',
  whiteSpace: 'nowrap',
  marginLeft: '$2',
  '&:first-child': {
    fontWeight: '$bold',
  },
  '&:not(:first-child):not(:last-child)': {
    '&::before': {
      content: '/',
      marginRight: '$2',
    },
  },
  '&:not(:first-child):last-child': {
    '&::before': {
      content: '∙',
      marginRight: '$2',
    },
  },

  a: {
    color: '$neutral4',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});
