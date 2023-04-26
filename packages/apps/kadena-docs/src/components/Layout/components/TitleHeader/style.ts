import { styled, StyledComponent } from '@kadena/react-components';

import { InnerWrapper } from '../styles';

export const HeaderWrapper: StyledComponent<'div'> = styled('div', {
  gridArea: 'pageheader',
  position: 'relative',
  display: 'grid',
  gridTemplateRows: 'auto 40px',
  gridTemplateAreas: `
  "main"
  "shadow"
  `,
  zIndex: 99,

  '@md': {
    zIndex: 101,
  },
});

export const StyledBackground: StyledComponent<'div'> = styled('div', {
  position: 'relative',
  gridRowStart: '1',
  gridRowEnd: '3',
  gridColumn: '1 / 2',
  background: 'url("/assets/bg-horizontal.png")',
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: 'center',
  backgroundPositionY: '95%',
  transform: 'scaleX(-1)',
  zIndex: 2,

  '@md': {
    transform: 'scaleX(1)',
  },
});

export const StyledBackgroundColor: StyledComponent<'div'> = styled('div', {
  position: 'relative',
  gridArea: 'main',
  backgroundColor: '$background',
  zIndex: 1,
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
