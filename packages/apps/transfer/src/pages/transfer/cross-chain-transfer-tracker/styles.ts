import { styled } from '@kadena/react-components';

export const StyledMainContent = styled('main', {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '$16',
});
export const StyledFormButton = styled('div', {
  mt: '$4',
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
  padding: '$4',
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
  padding: '$6 $10 0 $10',
  alignItems: 'flex-start',
  gap: '8px',
  alignSelf: 'stretch',
});

export const StyledInfoBox = styled('div', {
  fontSize: '$base',
  padding: '$2',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '$sm',
  boxSizing: 'borderBox',
  alignSelf: 'stretch',
  width: '40%',
});
