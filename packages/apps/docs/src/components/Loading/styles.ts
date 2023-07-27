import { keyframes, styled, StyledComponent } from '@kadena/react-components';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const Loader: StyledComponent<'div'> = styled('div', {
  width: '$6',
  height: '$6',
  animation: `${rotate} 1s infinite linear `,
});
