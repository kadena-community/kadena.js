import { style } from '@kadena/kode-ui';
import {
  atoms,
  globalStyle,
  responsiveStyle,
  token,
} from '@kadena/kode-ui/styles';

export const wrapperClass = style([
  atoms({
    paddingInline: 'sm',
  }),
  {
    height: '100%',
    width: '100%',
  },
]);
export const cardWrapperClass = style([
  {
    minHeight: '50dvh',
    width: '100%!important',
    maxWidth: '900px',
  },
  responsiveStyle({
    xs: {},
    md: {
      width: '75%!important',
    },
    xl: {
      width: '50%!important',
    },
  }),
]);
export const cardClass = style([
  {
    height: '100%',
    width: '100%!important',
  },
]);

export const footerClass = style({});

globalStyle(`${footerClass} *`, {
  color: token('color.text.gray.default'),
  fontSize: `${token('typography.fontSize.xs')}!important`,
});

globalStyle(`${footerClass} a`, {
  textDecoration: 'none',
});

globalStyle(`${footerClass} a:hover`, {
  textDecoration: 'underline',
});
