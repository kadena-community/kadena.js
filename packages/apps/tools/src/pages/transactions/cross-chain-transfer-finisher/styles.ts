import { styled } from '@kadena/react-components';

export const StyledFinisherContent = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '$16',
});
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
  fontSize: '$base',
  padding: '$sm',
  background: 'rgba(71, 79, 82, 0.5)',
  borderRadius: '$xs',
  boxSizing: 'borderBox',
  alignSelf: 'stretch',
  width: '40%',
});
export const StyledInfoTitle = styled('h3', {
  fontSize: '$base',
  marginBottom: '2%',
  textAlign: 'center',
});
export const StyledInfoItem = styled('div', {
  marginTop: '4%',
  fontSize: '$xs',
  padding: '$sm',
  background: 'rgba(71, 79, 82, 0.7)',
  borderRadius: '$xs',
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
  fontSize: '$xs',
  padding: '$sm',
  textAlign: 'right',
  cursor: 'pointer',
});
export const StyledResultContainer = styled('div', {
  fontSize: '$base',
});
export const StyledTotalContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  mx: '$sm',
  my: 'auto',
  padding: '$sm',
  borderRadius: '$xs',
  background: 'rgba(5, 5, 5, 0.5)',
  gap: '$4',
});
export const StyledTotalChunk = styled('div', {
  width: 'auto',
});
export const StyledErrorMessage = styled('div', {
  fontSize: '$sm',
  padding: '$xl',
  textAlign: 'right',
  cursor: 'pointer',
  color: 'salmon',
});
