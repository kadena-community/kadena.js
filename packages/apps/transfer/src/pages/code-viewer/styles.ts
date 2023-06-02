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

export const StyledResultContainer = styled('div', {
  fontSize: '1rem',
});

export const StyledCodeViewerContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  margin: '4% auto',
  padding: '8px',
  borderRadius: '4px',
  background: 'rgba(5, 5, 5, 0.5)',
});

export const StyledTotalContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',

  margin: '4% auto',
  padding: '8px',
  borderRadius: '4px',
  background: 'rgba(5, 5, 5, 0.5)',
});

export const StyledTotalChunk = styled('div', {
  width: '50%',
});
