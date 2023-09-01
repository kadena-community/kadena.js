import { styled } from '../../styles';

import { type StyledComponent } from '@stitches/react/types/styled-component';

export const StyledBreadcrumbs: StyledComponent<'ul'> = styled('ul', {
  display: 'flex',
  flexFlow: 'wrap',
  padding: 0,
  listStyle: 'none',
});

export const StyledBreadcrumbItem: StyledComponent<'li'> = styled('li', {
  display: 'flex',
  padding: 0,
  color: '$neutral4',
  whiteSpace: 'nowrap',

  '&::before': {
    margin: '0 $2',
  },

  '&:not(:first-child):not(:last-child)': {
    '&::before': {
      content: '/',
    },
  },
  '&:last-child': {
    '&::before': {
      content: '∙',
    },
  },
  '&:first-child': {
    fontWeight: '$bold',
    '&::before': {
      content: '',
      margin: '0',
    },
  },

  a: {
    display: 'flex',
    color: '$neutral4',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  span: {
    marginRight: '$1',
  },
});
