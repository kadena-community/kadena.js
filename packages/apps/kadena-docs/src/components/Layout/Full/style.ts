import { styled, StyledComponent } from '@kadena/react-components';

export const AsideList: StyledComponent<
  'ul',
  { inner?: boolean | 'true' | 'false' | undefined }
> = styled('ul', {
  listStyle: 'none',
  margin: 0,
  padding: '0',

  '& li::before': {
    content: '∙',
    color: '$primaryHighContrast',
    fontWeight: '$bold',
    display: 'inline-block',
    width: '$4',
    margin: '0 $1',
  },

  variants: {
    inner: {
      true: {
        paddingLeft: '$4',
      },
      false: {},
    },
  },
});

export const AsideItem: StyledComponent<'li'> = styled('li', {
  lineHeight: '$base',
  a: {
    textDecoration: 'none',
    color: '$primaryHighContrast',
    '&:hover': {
      textDecoration: 'underline',
      fontWeight: '$bold',
    },
  },
});

export const StickyAsideWrapper: StyledComponent<'div'> = styled('div', {
  position: 'fixed',
  display: 'flex',
  top: '$20',
});

export const StickyAside: StyledComponent<'div'> = styled('div', {
  position: 'sticky',
  top: '$10',
});
