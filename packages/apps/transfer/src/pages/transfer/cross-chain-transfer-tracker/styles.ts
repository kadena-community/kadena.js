import { styled } from '@kadena/react-components';

export const StyledMainContent = styled('main', {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '$16',
});
export const StyledFormButton = styled('div', {
  marginTop: '16px',
});
export const StyledForm = styled('form', {
  width: '75%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});
export const StyledSideContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});
export const StyledAccountForm = styled('div', {
  width: '75%',
  padding: '16px',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
  '> *': {
    mb: '$8 ',
  },
});
