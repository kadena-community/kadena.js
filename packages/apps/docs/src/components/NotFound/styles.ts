import { styled, StyledComponent } from '@kadena/react-components';
import { Stack } from '@kadena/react-ui';

export const Section: StyledComponent<typeof Stack> = styled(Stack, {
  padding: '$20 0 0',
  gap: '$2',
});
