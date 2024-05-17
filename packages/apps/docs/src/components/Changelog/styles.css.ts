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
    lineBreak: 'anywhere',
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

    fontFamily: 'monospaceFont',
    backgroundColor: 'semantic.positive.inverse.default',
  }),
  {
    padding: `calc(${tokens.kda.foundation.spacing.xs} / 4) ${tokens.kda.foundation.spacing.xs}`,
    fontSize: 'smaller',
    fontWeight: 'bolder',
    alignSelf: 'baseline',
  },
]);

export const tagContainerClass = style([
  atoms({
    justifyContent: 'flex-start',
    gap: 'xs',
    width: '100%',
    paddingInlineStart: 'md',
    paddingBlockStart: 'xs',
    paddingBlockEnd: 'md',
  }),
  {
    ...responsiveStyle({
      lg: {
        paddingInlineStart: 0,
        paddingBlockStart: 0,
        paddingBlockEnd: 0,
        width: '100px',
        justifyContent: 'flex-end',
      },
    }),
  },
]);
