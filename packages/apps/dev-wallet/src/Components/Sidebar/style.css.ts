import { sidebarTextColorClass } from '@/utils/color.ts';
import { atoms, tokens, vars } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const sidebarClass = style([
  atoms({
    position: 'relative',
    zIndex: 1,
  }),
  {
    borderRight: `1px solid ${vars.colors.$borderDefault}`,
    backgroundColor: tokens.kda.foundation.color.neutral.n1,
    maxHeight: 'calc(100vh - 100px)',
  },
]);

export const sidebarMenuClass = style([
  atoms({
    padding: 'n0',
    margin: 'n0',
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 'xxl',
    flex: 1,
    justifyContent: 'space-between',
  }),
]);

export const sidebarMenuOptionClass = style([
  atoms({
    margin: 'n0',
  }),
  {
    color: sidebarTextColorClass,
    minWidth: '192px',
  },
]);

export const sidebarLinkClass = style([
  atoms({
    textDecoration: 'none',
    fontSize: 'sm',
    display: 'block',
    padding: 'md',
  }),
  {
    minWidth: '192px',
    selectors: {
      '&.active': {
        background: tokens.kda.foundation.color.background.surface.default,
      },
      '&:focus, &:hover': {
        background: tokens.kda.foundation.color.background.surface.default,
      },
    },
  },
]);

export const fullHightClass = style({
  height: '100%',
});

export const displayContentsClass = style({
  display: 'contents',
});
