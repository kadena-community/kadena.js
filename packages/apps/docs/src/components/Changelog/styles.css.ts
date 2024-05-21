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
    width: '100%',

    ...responsiveStyle({
      md: {
        width: '100%',
      },
      lg: {
        width: '75%',
      },
    }),
  },
]);
export const versionsSectionMetaClass = style([
  atoms({}),
  {
    width: '100%',
    maxWidth: 'initial',
    ...responsiveStyle({
      lg: {
        width: '25%',
        maxWidth: '150px',
      },
    }),
  },
]);
export const versionMetaWrapperClass = style([
  atoms({
    paddingBlockStart: 'sm',
  }),
  {
    width: '100%',
    ...responsiveStyle({
      lg: {
        width: 'initial',
      },
    }),
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

export const contributorsHeaderClass = style([
  atoms({
    display: 'none',
  }),
  {
    ...responsiveStyle({
      lg: {
        display: 'flex',
      },
    }),
  },
]);

export const contributorListClass = style([
  atoms({
    paddingInlineStart: 'no',
    flexWrap: 'wrap',
  }),
  {
    listStyle: 'none',
    alignSelf: 'flex-end',

    ...responsiveStyle({
      lg: {
        alignSelf: 'flex-start',
      },
    }),
  },
]);
