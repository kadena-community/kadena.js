import { styled, StyledComponent } from '@kadena/react-components';

export const SearchForm: StyledComponent<'form'> = styled('form', {
  width: '100%',
});

export const StaticResultsList: StyledComponent<'ul'> = styled('ul', {
  listStyle: 'none',
  padding: 0,
});
