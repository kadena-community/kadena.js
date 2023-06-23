import { vars } from '@kadena/react-ui';

import { style } from '@vanilla-extract/css';

export const consentButton = style({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'transparent',
  fontSize: vars.fontSizes.$10xl,
  fontWeight: '$light',
  border: 'none',
});
