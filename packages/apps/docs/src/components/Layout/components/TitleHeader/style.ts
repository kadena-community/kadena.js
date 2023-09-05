import type { StyledComponent } from '@kadena/react-components';
import { styled } from '@kadena/react-components';

import { InnerWrapper } from '../styles';

export const HeaderWrapper: StyledComponent<'div'> = styled('div', {
  gridArea: 'pageheader',
  position: 'relative',
  display: 'grid',
  height: 'calc($sizes$64 + $sizes$10)',
  gridTemplateRows: '$sizes$64 $sizes$10',
  gridTemplateAreas: `
  "main"
  "shadow"
  `,
  zIndex: 99,

  '@md': {
    zIndex: 101,
  },

  '&::before': {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '$10',
    backgroundColor: '$background',
  },
  '&::after': {
    content: '',
    position: 'absolute',
    inset: 0,
    background: 'url("/assets/bg-horizontal.png")',
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'center',
    backgroundPositionY: '95%',
    transform: 'scaleX(-1)',

    '@md': {
      transform: 'scaleX(1)',
    },
  },
});

export const StyledHeader: StyledComponent<'header'> = styled('header', {
  position: 'relative',
  gridArea: 'main',
  backgroundColor: '$backgroundOverlayColor',
  zIndex: 3,
});

export const Wrapper: StyledComponent<typeof InnerWrapper> = styled(
  InnerWrapper,
  {
    justifyContent: 'center',
    flexDirection: 'column',

    paddingTop: '$20',
    paddingBottom: '$10',
    marginBottom: '$6',
  },
);

export const SubHeader: StyledComponent<'span'> = styled('span', {
  color: '$neutral4',
  textAlign: 'center',
});
