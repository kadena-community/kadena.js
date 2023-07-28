import { styled, StyledComponent } from '@kadena/react-components';

export const SearchForm: StyledComponent<'form'> = styled('form', {
  width: '100%',
});

export const StaticResultsList: StyledComponent<'ul'> = styled('ul', {
  listStyle: 'none',
  padding: 0,
});

export const ScrollBox: StyledComponent<
  'div',
  { disabled?: 'true' | 'false' | boolean }
> = styled('div', {
  position: 'relative',
  margin: '$2 0',
  defaultVariants: {
    disabled: false,
  },
  variants: {
    disabled: {
      true: {},
      false: {
        height: '55vh',
        overflowY: 'scroll',
      },
    },
  },
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

export const LoadingWrapper: StyledComponent<'div'> = styled('div', {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  justifyContent: 'center',
  padding: '$10 0',
  background: '$backgroundOverlayColor',
});
