import { styled, StyledComponent } from '@kadena/react-components';

export const SearchForm: StyledComponent<'form'> = styled('form', {
  width: '100%',
});

export const StaticResultsList: StyledComponent<'ul'> = styled('ul', {
  listStyle: 'none',
  padding: 0,
});

export const ScrollBox: StyledComponent<'div'> = styled('div', {
  height: '55vh',
  overflowY: 'scroll',
  margin: '$2 0',
});

export const StyledItem: StyledComponent<'li'> = styled('li', {
  marginBottom: '$4',
  '& a': {
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
  '& > span': {
    color: '$neutral4',
  },
});
