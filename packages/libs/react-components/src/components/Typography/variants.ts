/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201

export const font = {
  main: {
    fontFamily: '$main',
  },
  mono: {
    fontFamily: '$mono',
  },
} as const;

export const bold = {
  true: {
    fontWeight: '$extraBold',
  },
  false: {
    fontWeight: '$light',
  },
} as const;

export const textSize = {
  sm: {
    fontSize: '$xs',
  },
  md: {
    fontSize: '$sm',
  },
  lg: {
    fontSize: '$base',
  },
};
