import { styled } from '@kadena/react-components';

export const StyledMainContent = styled('main', {});

export const StyledFormContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
});

export const StyledForm = styled('form', {
  width: '65%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

export const StyledAccountForm = styled('div', {
  width: '100%',
  padding: '16px',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
  '> *': {
    mb: '$8 ',
  },
});

export const StyledFormButton = styled('div', {
  marginTop: '16px',
});
