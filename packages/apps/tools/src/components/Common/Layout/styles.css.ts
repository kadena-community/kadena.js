import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const headerStyle = style([
  atoms({
    position: 'fixed',
    top: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  }),
  {
    height: tokens.kda.foundation.size.n16,
  },
]);

export const mainStyle = style([
  atoms({
    width: '100%',
    backgroundColor: 'base.default',
  }),
  {
    height: '100vh',
  },
]);

export const gridItemMainStyle = style([
  atoms({
    width: '100%',
    overflowY: 'scroll',
    overflowX: 'hidden',
  }),
  {
    height: '100vh',
    width: '100vw',
    // paddingTop: tokens.kda.foundation.size.n20,
    paddingTop: tokens.kda.foundation.size.n16, // Same as the height of `headerStyle`
    // paddingInline: `calc(${tokens.kda.foundation.size.n20} + ${tokens.kda.foundation.size.n2})`,
    paddingInlineStart: tokens.kda.foundation.size.n12, // Same as the width of `sidebarStyle`
    borderRight: `${tokens.kda.foundation.border.width.hairline} solid ${tokens.kda.foundation.color.border.base.default}`,
    selectors: {
      '&.isMenuOpen': {
        paddingInlineStart: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.size.n20} + ${tokens.kda.foundation.size.n2})`,
      },
    },
  },
]);

export const sidebarStyle = style([
  atoms({
    position: 'fixed',
    left: 0,
    bottom: 0,
    display: 'flex',
    backgroundColor: 'layer.default',
    overflow: 'hidden',
    zIndex: 1,
  }),
  {
    width: tokens.kda.foundation.size.n12,
    top: tokens.kda.foundation.size.n16,
    transition: 'width 0.1s ease-in',
    borderRight: `${tokens.kda.foundation.border.width.hairline} solid ${tokens.kda.foundation.color.border.base.default}`,
    selectors: {
      '&.isMenuOpen': {
        width: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.size.n10})`,
      },
    },
  },
]);
