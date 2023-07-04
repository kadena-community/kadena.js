import { styled } from '@kadena/react-components';

export const StyledContainer = styled('div', {
  maxWidth: '100%',
  margin: '0 auto',

  variants: {
    type: {
      fixed: {
        width: '$pageWidth',
      },
      fluid: {
        width: '100%',
      },
    },
  },
});
