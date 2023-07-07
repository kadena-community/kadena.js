import { styled, StyledComponent } from '@kadena/react-components';

export const StyledList: StyledComponent<'ul'> = styled('ul', {
  margin: '$5 0',
  '& li': {
    '&::marker': {
      color: '$primaryHighContrast',
      fontWeight: '$bold',
    },

    '& ul': {
      paddingLeft: '$4',
      margin: 0,
    },
  },
});
