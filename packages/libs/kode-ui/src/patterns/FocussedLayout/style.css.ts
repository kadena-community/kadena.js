import {
  atoms,
  globalStyle,
  responsiveStyle,
  style,
  token,
} from './../../styles';

export const wrapperClass = style([
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

globalStyle('body', {
  padding: '0 !important',
  margin: '0 !important',
});

globalStyle(`${cardWrapperClass} [class^="Card"]`, {
  '@media': {
    'screen and (max-width: 48rem)': {
      borderRadius: '0',
      borderInlineWidth: 0,
    },
  },
});
