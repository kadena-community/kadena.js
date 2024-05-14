import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

// const borderColor = token('color.accent.brand.secondary');
const cardColor = 'rgba(255, 255, 255, 0.03)';

export const titleClass = style([
  atoms({
    fontSize: '5xl',
    lineHeight: '7xl',
    marginBlockEnd: 'sm',
  }),
]);

export const subtitleClass = style([
  atoms({
    fontWeight: 'primaryFont.regular',
  }),
]);

export const cardClass = style([
  atoms({
    borderRadius: 'xs',
    padding: 'md',
    textAlign: 'center',
    fontFamily: 'secondaryFont',
    width: '100%',
  }),
  {
    backgroundColor: cardColor,
    border: `1px solid ${cardColor}`,
  },
]);

export const imgClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 'xxl',
  }),
  {
    width: '40px',
    height: '40px',
    borderRadius: '2px',
    backgroundColor: cardColor,
  },
]);
export const aliasClass = style([
  atoms({
    fontSize: 'sm',
  }),
  { color: '#ffffff' },
]);

export const initialsClass = style([
  atoms({
    fontSize: '9xl',
    fontWeight: 'secondaryFont.bold',
  }),
]);

export const formField = atoms({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: 'sm',
});

export const linkClass = style([
  // atoms({
  //   fontSize: 'md',
  // }),
  {
    textDecoration: 'none',
  },
]);

export const linkTextClass = style([
  atoms({
    fontSize: 'sm',
    lineHeight: 'sm',
    // color: tokens.kda.foundation.color.palette.aqua.n50,
  }),
  {
    color: tokens.kda.foundation.color.palette.aqua.n50,
    // color: '#42CEA0 !important',
  },
]);
// //styleName: kda/foundation/typography/font/ui/base/regular/@lg;
// font-family: Kadena Space Grotesk;
// font-size: 16px;
// font-weight: 400;
// line-height: 20px;
// text-align: center;
//
// //styleName: kda/foundation/typography/font/ui/small/regular/@lg;
// font-family: Kadena Space Grotesk;
// font-size: 14px;
// font-weight: 400;
// line-height: 16px;
// text-align: left;
//
// //styleName: kda/foundation/typography/font/ui/base/regular/@lg;
// font-family: Kadena Space Grotesk;
// font-size: 16px;
// font-weight: 400;
// line-height: 20px;
// text-align: center;
