import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const authCard = style([
  atoms({
    // fontSize: '5xl',
    // lineHeight: '7xl',

    padding: 'xxl',
  }),
  {
    borderRadius: '1px',
    textAlign: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
]);

export const inputClass = style([
  // atoms({
  //   fontSize: '5xl',
  //   lineHeight: '7xl',
  //   marginBlockEnd: 'sm',
  // }),
  {
    border:
      '1px solid var(--kda-foundation-color-background-layer10-default, #F5F5F51A)',
  },
]);

export const iconStyle = style([
  atoms({
    fontSize: 'sm',
    //   lineHeight: '7xl',
    //   marginBlockEnd: 'sm',
  }),
  {
    // border:
    //   '1px solid var(--kda-foundation-color-background-layer10-default, #F5F5F51A)',
  },
]);

export const backBtnClass = style([
  atoms({
    textDecoration: 'none',
    //   lineHeight: '7xl',
    //   marginBlockEnd: 'sm',
  }),
  {
    // border:
    //   '1px solid var(--kda-foundation-color-background-layer10-default, #F5F5F51A)',
  },
]);
