import {
  darkTheme,
  Stack,
  styled,
  StyledComponent,
} from '@kadena/react-components';

import { InnerWrapper } from '../styles';

export const StyledFooter: StyledComponent<'footer'> = styled('footer', {
  position: 'relative',
  gridArea: 'footer',
  zIndex: '$menu',
  background: '$neutral2',

  [`.${darkTheme} &`]: {
    background: '$neutral3',
  },
});

export const Box: StyledComponent<typeof Stack> = styled(Stack, {
  margin: '$2 0',
  '@md': {
    flex: 'auto',
  },
});

export const InnerFooterWrapper: StyledComponent<typeof InnerWrapper> = styled(
  InnerWrapper,
  {
    flexDirection: 'column',
    '@md': {
      flexDirection: 'row',
    },
  },
);
