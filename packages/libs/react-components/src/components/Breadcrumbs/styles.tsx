import { styled } from '../../styles';

import { StyledComponent } from '@stitches/react/types/styled-component';

export const StyledBreadcrumbs: StyledComponent<'ul'> = styled('ul', {
  display: 'flex',
  flexFlow: 'wrap',
  padding: 0,
  listStyle: 'none',
});

export const StyledBreadcrumbItem: StyledComponent<'li'> = styled('li', {
  display: 'flex',
  padding: 0,
  gap: '$2',
  color: '$neutral4',
  whiteSpace: 'nowrap',
  marginLeft: '$2',

  '&:not(:first-child):not(:last-child)': {
    '&::before': {
      content: '/',
    },
  },
  '&:last-child': {
    '&::before': {
      content: '∙',
    },
    a: {
      pointerEvents: 'none',
    },
  },
  '&:first-child': {
    fontWeight: '$bold',
    marginLeft: '0',
    '&::before': {
      content: '',
    },
  },

  a: {
    color: '$neutral4',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  span: {
    marginTop: 'calc($1 /2)',
  },
});
