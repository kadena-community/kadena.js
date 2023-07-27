import {
  darkTheme,
  Stack,
  styled,
  StyledComponent,
} from '@kadena/react-components';

import { InnerWrapper } from '@/components/Layout/components/styles';

export const Wrapper: StyledComponent<typeof InnerWrapper> = styled(
  InnerWrapper,
  {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    background: '$backgroundOverlayColor',
    padding: '$20 $12 $10 $4',
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

export const StyledStack: StyledComponent<typeof Stack> = styled(Stack, {
  '@md': {
    flexWrap: 'nowrap',
  },
});
