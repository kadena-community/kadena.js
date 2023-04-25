import { styled, StyledComponent } from '@kadena/react-components';

import { InnerWrapper } from '@/components/Layout/components';

export const StyledBackground: StyledComponent<'div'> = styled('div', {
  position: 'absolute',
  inset: 0,
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
    background: '$backgroundOverlayColor',
    paddingTop: '$20',
    paddingBottom: '$10',
    marginBottom: '$6',
  },
);

export const StyledHeader: StyledComponent<'header'> = styled('header', {
  position: 'relative',
  gridArea: 'pageheader',
  height: '300px',
});
