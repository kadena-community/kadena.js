import { styled } from '@kadena/react-components';

export const StyledMainContent = styled('main', {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '$16',
});

export const StyledForm = styled('form', {
  width: '75%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
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

export const StyledFormButton = styled('div', {
  marginTop: '16px',
});

export const StyledToggleContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row-reverse',
});

export const StyledFieldCheckbox = styled('div', {
  width: '30%',
  display: 'flex',
  flexDirection: 'row',
});
export const StyledCheckbox = styled('input', {
  width: '20px',
});

export const StyledCheckboxLabel = styled('label', {
  fontSize: '1rem',
  marginLeft: '12px',
  color: 'white',
  fontWeight: '500',
  lineHeight: '17px',
});

export const StyledSideContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

export const StyledInfoBox = styled('div', {
  marginTop: '8%',
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
