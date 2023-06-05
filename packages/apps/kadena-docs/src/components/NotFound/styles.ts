import { Stack, styled, StyledComponent } from '@kadena/react-components';

export const Section: StyledComponent<typeof Stack> = styled(Stack, {
  padding: '$20 0',
  gap: '$2',
});
