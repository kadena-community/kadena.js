import {
  atoms,
  darkThemeClass,
  responsiveStyle,
  tokens,
} from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const backgroundClass = style([
  {
    backgroundColor: tokens.kda.foundation.color.background.surface.default,
  },
]);

export const versionsSectionClass = style([
  atoms({}),
  {
    backgroundColor: tokens.kda.foundation.color.background.surface.default,
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
    gap: 'sm',
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
    fontFamily: 'monospaceFont',
    borderRadius: 'sm',
    textDecoration: 'none',
  }),
  {
    color: tokens.kda.foundation.color.text.base.inverse.default,
    backgroundColor:
      tokens.kda.foundation.color.background.semantic.positive.inverse.default,
    opacity: 0.4,
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

globalStyle(`${commitListItemClass}:hover ${commitTagClass}`, {
  opacity: 1,
  backgroundColor:
    tokens.kda.foundation.color.background.semantic.positive.inverse.default,
});
globalStyle(`${commitListItemClass} ${commitTagClass}:hover`, {
  opacity: 1,
  backgroundColor:
    tokens.kda.foundation.color.background.semantic.positive.default,
});

globalStyle(
  `${darkThemeClass} ${commitListItemClass}:hover ${commitTagClass}`,
  {
    opacity: 1,
    backgroundColor:
      tokens.kda.foundation.color.background.semantic.positive['@hover'],
    color: tokens.kda.foundation.color.text.base['@hover'],
  },
);
globalStyle(
  `${darkThemeClass} ${commitListItemClass} ${commitTagClass}:hover`,
  {
    opacity: 1,
    backgroundColor:
      tokens.kda.foundation.color.background.semantic.positive.inverse.default,
    color: tokens.kda.foundation.color.text.base.inverse['@init'],
  },
);
