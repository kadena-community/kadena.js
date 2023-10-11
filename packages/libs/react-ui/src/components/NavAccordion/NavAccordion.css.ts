import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const navAccordionWrapperClass = style({});

export const navAccordionLinkClass = style({
  selectors: {
    'nav > &': {
      borderBottom: `1px solid ${vars.colors.$borderDefault}`,
      color: vars.colors.$neutral5,
      display: 'flex',
      fontSize: vars.fontSizes.$base,
      fontWeight: vars.fontWeights.$semiBold,
      paddingBottom: vars.sizes.$2,
      textDecoration: 'none',
    },
    'nav > &:hover': {
      textDecoration: 'underline',
    },
  },
});
