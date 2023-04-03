/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201

export const spacing = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2xs': {
    gap: '$2xs',
  },
  xs: {
    gap: '$xs',
  },
  sm: {
    gap: '$3',
  },
  md: {
    gap: '$md',
  },
  lg: {
    gap: '$lg',
  },
  xl: {
    gap: '$xl',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2xl': {
    gap: '$2xl',
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '3xl': {
    gap: '$3xl',
  },
} as const;

export const justifyContent = {
  'flex-start': {
    justifyContent: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
  'flex-end': {
    justifyContent: 'flex-end',
  },
  'space-between': {
    justifyContent: 'space-between',
  },
  'space-around': {
    justifyContent: 'space-around',
  },
} as const;

export const alignItems = {
  'flex-start': {
    alignItems: 'flex-start',
  },
  center: {
    alignItems: 'center',
  },
  'flex-end': {
    alignItems: 'flex-end',
  },
  stretch: {
    alignItems: 'stretch',
  },
} as const;

export const flexWrap = {
  wrap: {
    flexWrap: 'wrap',
  },
  nowrap: {
    flexWrap: 'nowrap',
  },
} as const;

export const direction = {
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
} as const;
