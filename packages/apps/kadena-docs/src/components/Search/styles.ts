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

export const StyledItem: StyledComponent<'a'> = styled('a', {
  display: 'block',
  marginBottom: '$4',
  textDecoration: 'none',
  padding: '$sm',

  '& > span': {
    color: '$neutral4',
  },

  '&:hover, &:focus': {
    color: '$neutral100',
    backgroundColor: '$primaryContrast',
    borderRadius: '$sm',
    '&: h5': {
      textDecoration: 'underline',
    },
    '& > span, & > p': {
      color: '$neutral100',
    },
  },
});
export const StyledListItem: StyledComponent<'li'> = styled('li', {});
