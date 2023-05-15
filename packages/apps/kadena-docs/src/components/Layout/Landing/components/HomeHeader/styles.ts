import { darkTheme, styled, StyledComponent } from '@kadena/react-components';

import { InnerWrapper } from '@/components/Layout/components/styles';

export const Wrapper: StyledComponent<typeof InnerWrapper> = styled(
  InnerWrapper,
  {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    background: '$backgroundOverlayColor',
    paddingTop: '$20',
    paddingLeft: '$12',
    paddingRight: '$12',
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

export const SubHeader: StyledComponent<'span'> = styled('span', {
  color: '$neutral3',
  fontSize: '$xl',
  [`.${darkTheme} &`]: {
    color: '$neutral4',
  },
});
