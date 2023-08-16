import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const dividerClass = style({
  borderColor: `${vars.colors.$borderDefault}`,
  borderWidth: '1px',
  margin: `${vars.sizes.$10} 0`,
  borderBottomWidth: '0',
});
