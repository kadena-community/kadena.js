/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201

import { styled } from '../../styles';

export const StyledInputGroupWrapper = styled('div', {
  color: '$foreground',
  '&.disabled': {
    color: '$neutral3',
  },
});

export const StyledInputGroupHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  pb: '$2',
});

export const StyledLabel = styled('label', {
  fontWeight: '$medium',
  fontSize: '$sm',
});

export const StyledTag = styled('span', {
  ml: '$4',
  backgroundColor: '$foreground',
  color: '$neutral1',
  borderRadius: '$xs',
  py: '$1',
  px: '$2',
  display: 'inline-block',
  fontSize: '$xs',
  lineHeight: '$base',
  fontWeight: '$medium',
  '&.disabled': {
    backgroundColor: '$neutral3',
  },
});

export const StyledInfo = styled('span', {
  marginLeft: 'auto',
  fontSize: '$xs',
  display: 'flex',
  alignItems: 'center',
  '> span': {
    pr: '$1',
  },
});

export const StyledHelper = styled('span', {
  mt: '$4',
  display: 'flex',
  alignItems: 'center',
  fontSize: '$xs',
  '> span': {
    pl: '$2',
  },
  '&:not(.disabled)': {
    '&.success > svg': {
      color: '$positiveAccent',
    },
    '&.error > svg': {
      color: '$negativeAccent',
    },
  },
  '&.disabled': {
    '& > svg': {
      color: '$neutral3',
    },
  },
});

export const StyledInputWrapper = styled('div', {
  backgroundColor: '$background',
  display: 'flex',
  borderRadius: '$sm',
  borderBottom: '1px solid $borderColor',
  height: '$12',
  alignItems: 'center',
  lineHeight: '$code',
  '&.success': {
    borderColor: '$positiveAccent',
  },
  '&.error': {
    borderColor: '$negativeAccent',
  },
  '&.disabled': {
    backgroundColor: '$neutral2',
    borderColor: '$borderColor',
    color: '$neutral3',
    '*': {
      color: 'inherit',
    },
  },
});

export const StyledLeadingText = styled('span', {
  px: '$4',
  py: '$2',
  backgroundColor: '$neutral2',
  borderTopLeftRadius: '$sm',
  borderBottomLeftRadius: '$sm',
  height: '100%',
});

export const StyledIconWrapper = styled('span', {
  px: '$4',
  py: '$2',
  fontSize: '$base',
});

export const StyledInput = styled('input', {
  background: 'none',
  px: '$4',
  border: 'none',
  flex: '1',
  outline: 'none',
  fontSize: 'inherit',
  color: '$foreground',
  '&.hasLeadingText': {
    py: '$2',
  },
});

export const StyledInputs = styled('div', {
  '& > *': {
    borderRadius: '0',
    '&:first-child': {
      borderTopRightRadius: '$sm',
      borderTopLeftRadius: '$sm',
    },
    '&:last-child': {
      borderBottomRightRadius: '$sm',
      borderBottomLeftRadius: '$sm',
    },
  },
});
