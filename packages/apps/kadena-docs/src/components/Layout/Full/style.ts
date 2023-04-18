import { styled, StyledComponent } from '@kadena/react-components';

export const AsideList: StyledComponent<
  'ul',
  { inner?: boolean | 'true' | 'false' | undefined }
> = styled('ul', {
  listStyle: 'none',
  margin: 0,
  padding: '0',

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
    color: '$primarySurfaceInverted',
    '&:hover': {
      textDecoration: 'underline',
      fontWeight: '$bold',
    },
  },
});
