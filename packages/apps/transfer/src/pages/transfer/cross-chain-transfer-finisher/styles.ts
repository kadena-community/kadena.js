import { styled } from '@kadena/react-components';

export const StyledForm = styled('form', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

export const StyledAccountForm = styled('div', {
  width: '100%',
  padding: '$4',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '$sm',
  boxSizing: 'borderBox',
  '> *': {
    mb: '$8',
  },
});

export const StyledFormButton = styled('div', {
  mt: '$4',
});

export const StyledToggleContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row-reverse',
});

export const StyledFieldCheckbox = styled('div', {
  display: 'flex',
  flexDirection: 'row',
});
export const StyledCheckbox = styled('input', {
  width: '$4',
});

export const StyledCheckboxLabel = styled('label', {
  fontSize: '$base',
  ml: '$3',
  color: 'white',
  fontWeight: '$medium',
  lineHeight: '$base',
});

export const StyledInfoBox = styled('div', {
  fontSize: '0.75rem',
  padding: '8px',
  background: 'rgba(71, 79, 82, 0.5)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
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
});

export const StyledInfoItemTitle = styled('div', {
  textTransform: 'uppercase',
  textAlign: 'center',
});

export const StyledInfoItemLine = styled('div', {
  display: 'inline-block',
  wordBreak: 'break-word',
});

export const StyledShowMore = styled('div', {
  fontSize: '0.65rem',
  padding: '16px',
  textAlign: 'right',
  cursor: 'pointer',
});

export const StyledResultContainer = styled('div', {
  fontSize: '1rem',
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
  width: '45%',
});

export const StyledErrorMessage = styled('div', {
  marginTop: '8%',
  fontSize: '0.85rem',
  padding: '16px',
  textAlign: 'right',
  cursor: 'pointer',
  color: 'salmon',
});
