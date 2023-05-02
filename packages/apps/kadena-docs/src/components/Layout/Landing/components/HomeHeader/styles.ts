import { styled, StyledComponent } from '@kadena/react-components';

import { InnerWrapper } from '@/components/Layout/components/styles';

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
  zIndex: 2,
  gridArea: 'pageheader',

  '&::before': {
    content: '',
    position: 'absolute',
    inset: 0,
    background: 'url("/assets/bg-horizontal.png")',
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'center',
    backgroundPositionY: '0%',
    transform: 'scale(-1, -1)',
  },
});
