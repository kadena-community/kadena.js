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

export const Aside: StyledComponent<'aside'> = styled('aside', {
  position: 'relative',
  display: 'none',
  width: '25%',
  overflow: 'hidden',
  paddingLeft: '$4',
  '@md': {
    display: 'block',
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

//TODO: under construction
export const SideBackgroundWrapper: StyledComponent<'div'> = styled('div', {
  position: 'absolute',
  right: '0',
  top: '-$40',
  '@md': {
    right: '-$40',
  },
});
