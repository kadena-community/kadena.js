import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';

import { globalStyle, style } from '@vanilla-extract/css';

export const inlineCode = style([
  sprinkles({
    borderRadius: '$sm',
    backgroundColor: '$neutral2',
  }),
  {
    padding: `calc(${vars.sizes.$1} / 4) ${vars.sizes.$1}`,
  },
]);

export const codeWrapper = style([
  sprinkles({
    backgroundColor: '$blue100',
    fontSize: '$sm',
    fontFamily: '$mono',
    lineHeight: '$lg',
    marginX: '$5',
    marginY: '$10',
  }),
  {
    borderRadius: vars.radii.$lg,
    overflow: 'hidden',
    wordBreak: 'break-all',
  },
]);

export const code = style([
  sprinkles({
    whiteSpace: 'break-spaces',
    fontFamily: '$mono',
    display: 'none',
    paddingY: '$3',
    position: 'relative',
  }),
  {
    counterReset: 'line',
    selectors: {
      [`${darkThemeClass} &[data-theme="dark"], &[data-theme="light"]`]: {
        display: 'block',
      },

      [`${darkThemeClass} &[data-theme="light"]`]: {
        display: 'none',
      },

      '&::before': {
        content: '',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: vars.sizes.$10,
        background: vars.colors.$blue90,
        zIndex: 0,
        opacity: 0.6,
      },
    },
  },
]);

export const codeLine = style([
  sprinkles({
    width: '100%',
    fontFamily: '$mono',
    zIndex: 1,
    paddingRight: '$4',
  }),
  {
    display: 'inline-flex',
    cursor: 'default',

    selectors: {
      '&:hover': {
        background: vars.colors.$black,
      },
      '&::marker': {
        content: '',
      },
      '&::before': {
        counterIncrement: 'line',
        content: 'counter(line)',
        overflowWrap: 'normal',
        display: 'inline-flex',
        width: '1rem',
        marginRight: `${vars.sizes.$4}`,
        marginLeft: `${vars.sizes.$4}`,
        marginTop: '3px', //hack, this just aligns the number the best. with vars or display: flex. the alignment is of
        textAlign: 'right',
        fontSize: vars.sizes.$sm,
        color: vars.colors.$white,
        zIndex: 1,
      },
    },
  },
]);

globalStyle(`code span`, {
  fontFamily: vars.fonts.$mono,
});

globalStyle(`code span::selection`, {
  background: vars.colors.$blue80,
});

export const codeTitle = style([
  sprinkles({
    display: 'none',
    alignItems: 'center',
    fontFamily: '$main',
    background: '$blue70',
    color: '$white',
    fontWeight: '$bold',
    textTransform: 'capitalize',
    padding: '$2',
  }),
  {
    selectors: {
      [`${darkThemeClass} &[data-theme="dark"], &[data-theme="light"]`]: {
        display: 'flex',
      },

      [`${darkThemeClass} &[data-theme="light"]`]: {
        display: 'none',
      },
      '&[data-language]::before': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: `0 ${vars.sizes.$2}`,
        color: vars.colors.$white,
        backgroundColor: vars.colors.$blue90,
        borderRadius: vars.radii.$sm,
        width: vars.sizes.$6,
        height: vars.sizes.$6,
        fontFamily: vars.fonts.$mono,
        fontWeight: 'bold',
        fontSize: 'smaller',
      },
      '&[data-language="pact"]::before': {
        content: 'P',
      },

      '&[data-language="lisp"]::before': {
        content: 'L',
      },

      '&[data-language="typescript"]::before': {
        content: 'TS',
      },
      '&[data-language="ts"]::before': {
        content: 'TS',
      },

      '&[data-language="javascript"]::before': {
        content: 'JS',
      },
      '&[data-language="js"]::before': {
        content: 'JS',
      },

      '&[data-language="yaml"]::before': {
        content: 'Y',
      },

      '&[data-language="json"]::before': {
        content: 'J',
      },

      '&[data-language="bash"]::before': {
        content: 'B',
      },

      '&[data-language="shell"]::before': {
        content: 'S',
      },
      '&[data-language="sh"]::before': {
        content: 'S',
      },
    },
  },
]);
