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
    backgroundColor: '$neutral2',
    fontSize: '$sm',
    fontFamily: '$mono',
    lineHeight: '$lg',
    marginX: '$5',
    marginY: 0,
  }),
  {
    borderLeft: `4px solid ${vars.colors.$borderDefault}`,
    borderRadius: `${vars.radii.$sm} 0px 0px ${vars.radii.$sm}`,
    wordBreak: 'break-all',
  },
]);

export const code = style([
  sprinkles({
    whiteSpace: 'break-spaces',
    fontFamily: '$mono',
    display: 'none',
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
    },
  },
]);

export const codeLine = style([
  sprinkles({
    width: '100%',
    display: 'inline-block',
    fontFamily: '$mono',
  }),
  {
    selectors: {
      '&::before': {
        counterIncrement: 'line',
        content: 'counter(line)',
        overflowWrap: 'normal',
        display: 'inline-block',
        width: '1rem',
        marginRight: `${vars.sizes.$4}`,
        marginLeft: `${vars.sizes.$4}`,
        textAlign: 'right',
        fontSize: `${vars.sizes.$sm}`,
        color: `${vars.colors.$neutral3}`,
      },
    },
  },
]);

globalStyle(`code span`, {
  fontFamily: vars.fonts.$mono,
});

export const codeTitle = style([
  sprinkles({
    display: 'none',
    alignItems: 'center',
    fontFamily: '$main',
    backgroundColor: '$neutral3',
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
        color: `${vars.colors.$background}`,
        backgroundColor: `${vars.colors.$primaryContrast}`,
        borderRadius: `${vars.radii.$sm}`,
        width: `${vars.sizes.$6}`,
        height: `${vars.sizes.$6}`,
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
