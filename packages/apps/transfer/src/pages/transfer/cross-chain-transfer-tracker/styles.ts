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

export const StyledInfoBox = styled('div', {
  fontSize: '1rem',
  padding: '8px',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
  width: '40%',
});
export const StyledInfoTitle = styled('h3', {
  marginBottom: '2%',
  textAlign: 'center',
});

export const StyledInfoItem = styled('div', {
  marginTop: '4%',
  fontSize: '0.75rem',
  padding: '8px',
  background: 'rgba(71, 79, 82, 0.7)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
  flexDirection: 'column',
});

export const StyledInfoItemTitle = styled('div', {
  textTransform: 'uppercase',
  textAlign: 'center',
});

export const StyledInfoItemLine = styled('div', {
  display: 'inline-block',
  wordBreak: 'break-word',
});
