import { styled, StyledComponent } from '@kadena/react-components';

import { InnerWrapper } from '../styles';
export const StyledBackground: StyledComponent<'div'> = styled('div', {
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  background: 'url("/assets/bg-horizontal.png")',
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: 'center',
  backgroundPositionY: '90%',
  transform: 'scaleX(-1)',

  '@md': {
    transform: 'scaleX(1)',
  },
});

export const Wrapper: StyledComponent<typeof InnerWrapper> = styled(
  InnerWrapper,
  {
    justifyContent: 'center',
    flexDirection: 'column',
    background: '$backgroundOverlayColor',
    paddingTop: '$20',
    paddingBottom: '$10',
    marginBottom: '$6',
  },
);

export const StyledHeader: StyledComponent<'header'> = styled('header', {
  position: 'relative',
  gridArea: 'pageheader',
});

export const SubHeader: StyledComponent<'span'> = styled('span', {
  color: '$neutral4',
});
