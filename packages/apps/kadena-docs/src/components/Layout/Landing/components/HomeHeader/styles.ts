import { styled, StyledComponent } from '@kadena/react-components';

import { InnerWrapper } from '@/components/Layout/components/styles';

export const StyledBackground: StyledComponent<'div'> = styled('div', {
  position: 'absolute',
  inset: 0,
  background: 'url("/assets/bg-horizontal.png")',
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: 'center',
  backgroundPositionY: '0%',
  transform: 'scale(-1, -1)',
});

export const Wrapper: StyledComponent<typeof InnerWrapper> = styled(
  InnerWrapper,
  {
    background: '$backgroundOverlayColor',
    paddingTop: '$20',
    paddingLeft: '$12',
    paddingBottom: '$10',
    marginBottom: '$16',
  },
);

export const StyledHeader: StyledComponent<'header'> = styled('header', {
  position: 'relative',
  gridArea: 'pageheader',
});
