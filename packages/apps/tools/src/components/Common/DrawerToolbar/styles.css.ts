import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const gridItemCollapsedSidebarStyle = style([
  atoms({
    position: 'fixed',
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'base.default',
    fontSize: 'sm',
    zIndex: 1,
  }),
  {
    width: tokens.kda.foundation.size.n12,
    right: tokens.kda.foundation.size.n12,
    top: tokens.kda.foundation.size.n16,
    height: '100vh',
    borderLeft: `${tokens.kda.foundation.border.width.hairline} solid ${tokens.kda.foundation.color.border.base.default}`,
    transition: 'width 0.1s ease',
    selectors: {
      '&.isOpen': {
        width: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.size.n12})`,
      },
    },
  },
]);

export const gridItemMiniMenuStyle = style([
  atoms({
    height: '100%',
    flexDirection: 'column',
    position: 'relative',
  }),
  {
    borderLeft: `${tokens.kda.foundation.border.width.hairline} solid ${tokens.kda.foundation.color.border.base.default}`,
    transition: 'width 0.1s ease',
    selectors: {
      '&.isOpen': {
        width: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.size.n20})`,
      },
    },
  },
]);

export const buttonWrapperClass = style([
  atoms({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  }),
  {
    borderBottom: `${tokens.kda.foundation.border.width.hairline} solid ${tokens.kda.foundation.color.border.base.default}`,
  },
]);

export const expandedDrawerTitleClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'secondaryFont.bold',
    backgroundColor: 'layer10.default',
  }),
  {
    borderBottom: `${tokens.kda.foundation.border.width.hairline} solid ${tokens.kda.foundation.color.border.base.default}`,
    paddingLeft: '1.25rem',
  },
]);

export const expandedDrawerContentClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    overflowY: 'auto',
    height: `calc(100% - ${tokens.kda.foundation.size.n20})`,
    zIndex: 99,
  },
]);

export const expandedDrawerContentStyle = style([
  atoms({
    display: 'flex',
    flexDirection: 'row',
    position: 'fixed',
    right: 0,
    bottom: 0,
    backgroundColor: 'layer10.default',
    fontSize: 'sm',
  }),
  {
    width: tokens.kda.foundation.size.n12,
    top: tokens.kda.foundation.size.n16,
    height: '100vh',
    overflowY: 'auto',
    zIndex: 99,
  },
]);
