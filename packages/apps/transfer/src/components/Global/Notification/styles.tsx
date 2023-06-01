import { styled } from '@kadena/react-components';

export const StyledContainer = styled('div', {
  borderLeftWidth: '4px',
  borderColor: '#FF8A00',
  padding: '1rem', // 16px
  borderRadius: '0.25rem', // 4px
  backgroundColor: 'rgb(112 67 0 / 0.8)',
  display: 'flex',
  flexDirection: 'row',
  gap: '0.625rem', //10px
  marginBottom: '1.5rem', // 24px
});

export const StyledBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});
