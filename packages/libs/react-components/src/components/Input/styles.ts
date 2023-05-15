/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201

import { styled } from '../../styles';

export const styleVariant = {} as const;

export const StyledInputGroupWrapper = styled('div', {
  color: '$colors$neutral6',
  '&.disabled': {
    color: '$colors$neutral3',
  },
});

export const StyledInputGroupHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  paddingBottom: '8px',
  '*': {
    display: 'inline-block',
  },
});

export const StyledLabel = styled('label', {
  fontWeight: '500',
  fontSize: '14px',
});

export const StyledTag = styled('span', {
  marginLeft: '16px',
  height: '18px',
  backgroundColor: '$colors$neutral6',
  color: '$colors$neutral1',
  borderRadius: '2px',
  padding: '2px 8px',
  display: 'inline-block',
  fontSize: '12px',
  lineHeight: '12px',
  fontWeight: '500',
  '&.disabled': {
    backgroundColor: '$colors$neutral3',
  },
});

export const StyledInfo = styled('span', {
  marginLeft: 'auto',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  '> span': {
    paddingRight: '6px',
  },
});

export const StyledHelper = styled('span', {
  marginTop: '14px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '12px',
  '> span': {
    paddingLeft: '10px',
  },
  '&:not(.disabled)': {
    '&.success > svg': {
      color: '$colors$positiveAccent',
    },
    '&.error > svg': {
      color: '$colors$negativeAccent',
    },
  },
  '&.disabled': {
    '& > svg': {
      color: '$colors$neutral3',
    },
  },
});

export const StyledInputWrapper = styled('div', {
  backgroundColor: '$colors$neutral1',
  display: 'flex',
  borderRadius: '4px',
  borderBottom: '1px solid $colors$neutral3',
  height: '48px',
  alignItems: 'center',
  lineHeight: '2',
  '&.success': {
    borderColor: '$colors$positiveAccent',
  },
  '&.error': {
    borderColor: '$colors$negativeAccent',
  },
  '&.disabled': {
    backgroundColor: '$colors$neutral2',
    borderColor: '$colors$neutral3',
    color: '$colors$neutral4',
    '*': {
      color: 'inherit',
    },
  },
});

export const StyledLeadingText = styled('span', {
  padding: '8px 16px',
  backgroundColor: '$colors$neutral2',
  borderRadius: '4px 0 0 4px',
  height: '100%',
});

export const StyledIconWrapper = styled('span', {
  padding: '8px 16px',
  fontSize: '16px',
  '> *': {
    display: 'flex',
    alignItems: 'center',
  },
});

export const StyledInput = styled('input', {
  background: 'none',
  padding: '8px 0',
  border: 'none',
  flex: '1',
  outline: 'none',
  fontSize: 'inherit',
  color: '$colors$neutral6',
  '&.hasLeadingText': {
    paddingLeft: '16px',
    paddingRight: '16px',
  },
});
