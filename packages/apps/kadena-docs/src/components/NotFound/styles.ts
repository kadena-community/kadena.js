import { styled, StyledComponent } from '@kadena/react-components';

export const Section: StyledComponent<'section'> = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '$20 0',
  gap: '$2',
});
