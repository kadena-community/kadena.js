import {
  type StyledComponent,
  darkTheme,
  IconButton,
  styled,
} from '@kadena/react-components';

export const HamburgerButton: StyledComponent<typeof IconButton> = styled(
  IconButton,
  {
    background: '$neutral4 !important',
    display: 'flex',
    '@md': {
      display: 'none',
    },
  },
);

export const SkipNav: StyledComponent<'a'> = styled('a', {
  position: 'absolute',
  top: '0',
  left: 0,
  background: 'red',
  padding: '$2 $4',
  zIndex: '$modal',
  color: '$neutral6',
  fontWeight: '$bold',
  transform: 'translateY(-40px)',
  transition: 'transform .1s ease-in, opacity .1s ease-in',
  opacity: 0,
  '&:focus': {
    transform: 'translateY(0)',
    opacity: 1,
  },
});

export const HeaderIconGroup: StyledComponent<'div'> = styled('div', {
  display: 'flex',
  gap: '$1',
  marginLeft: '$6',
});

export const HeaderSocialIconGroup: StyledComponent<typeof HeaderIconGroup> =
  styled(HeaderIconGroup, {
    display: 'none',
    '@lg': {
      display: 'flex',
    },
  });

export const HideOnMobile: StyledComponent<'div'> = styled('div', {
  display: 'none',
  '@md': {
    display: 'flex',
  },
});

export const StyledSearchButton: StyledComponent<'button'> = styled('button', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '$neutral4',
  borderRadius: '$lg',
  border: 0,
  cursor: 'pointer',
  transition: 'opacity .2s ease',
  '&:hover': {
    opacity: '.6',
  },
  '&:focus-visible': {
    outlineOffset: '2px',
    outline: '2px solid $$svgColor',
  },
  svg: {
    color: '$neutral100',
  },
  [`.${darkTheme} &`]: {
    background: '$neutral3 !important',
  },
});

export const StyledSearchButtonSlash: StyledComponent<'span'> = styled('span', {
  background: '$neutral3',
  borderRadius: '$lg',
  [`.${darkTheme} &`]: {
    background: '$neutral4',
  },
});
