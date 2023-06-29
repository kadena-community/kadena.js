import { styled } from '@kadena/react-components';

export const StyledMainContent = styled('main', {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '$16',
});
export const StyledFormButton = styled('div', {
  marginTop: '16px',
  // display: 'flex',
  // padding: '8px 16px',
  alignItems: 'center',
  gap: '$8',
});
export const StyledForm = styled('form', {
  width: '75%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});
export const StyledSideContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});
export const StyledAccountForm = styled('div', {
  padding: '16px',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
  '> *': {
    mb: '$8 ',
  },
  alignSelf: 'stretch',
});

export const StyledFormHeader = styled('div', {
  display: 'flex',
  padding: '24px 40px 0px 40px',
  alignItems: 'flex-start',
  gap: '8px',
  alignSelf: 'stretch',
});

export const StyledInfoBox = styled('div', {
  fontSize: '1rem',
  padding: '8px',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
  alignSelf: 'stretch',
  width: '40%',
});
