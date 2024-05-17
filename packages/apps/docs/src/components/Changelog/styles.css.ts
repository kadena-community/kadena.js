import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const backgroundClass = style([
  {
    backgroundColor: tokens.kda.foundation.color.neutral['n99@alpha10'],
  },
]);

export const versionsSectionClass = style([
  atoms({}),
  {
    backgroundColor: tokens.kda.foundation.color.neutral['n99@alpha10'],
  },
]);

export const commitListClass = style([
  atoms({
    paddingInlineStart: 'sm',
  }),
]);
export const commitListItemClass = style([
  atoms({
    width: '100%',
    display: 'flex',
  }),
  {
    flexDirection: 'column',
    ...responsiveStyle({
      sm: {
        flexDirection: 'row',
      },
      md: {
        flexDirection: 'column',
      },
      lg: {
        flexDirection: 'row',
      },
    }),
  },
]);
export const commitListItemTitleClass = style([
  {
    selectors: {
      '&::before': {
        content: '•',
        paddingInlineEnd: tokens.kda.foundation.spacing.sm,
      },
    },
  },
]);

export const commitTagClass = style([
  atoms({
    borderRadius: 'sm',
    color: 'text.base.inverse.default',
    marginInlineStart: 'xs',
    marginInlineEnd: 'xs',
    fontFamily: 'monospaceFont',
    backgroundColor: 'semantic.positive.inverse.default',
  }),
  {
    padding: `calc(${tokens.kda.foundation.spacing.xs} / 4) ${tokens.kda.foundation.spacing.xs}`,
    fontSize: 'smaller',
    fontWeight: 'bolder',
  },
]);
