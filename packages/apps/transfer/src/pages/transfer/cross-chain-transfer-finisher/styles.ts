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
