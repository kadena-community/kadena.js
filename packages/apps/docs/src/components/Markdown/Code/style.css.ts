import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

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
    selectors: {
      '&[data-active-theme="dark"][data-theme="light"]': {
        display: 'none',
      },
      '&[data-active-theme="light"][data-theme="dark"]': {
        display: 'none',
      },
    },
  },
]);

export const code = style([
  sprinkles({
    whiteSpace: 'break-spaces',
    fontFamily: '$mono',
  }),
  {
    counterReset: 'line',
    selectors: {
      '&[data-active-theme="dark"][data-theme="light"]': {
        display: 'none',
      },
      '&[data-active-theme="light"][data-theme="dark"]': {
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

export const codeWord = style([
  sprinkles({
    fontFamily: '$mono',
  }),
]);

export const codeTitle = style([
  {
    display: 'flex',
    alignItems: 'center',
    fontFamily: `${vars.fonts.$main}`,
    background: `${vars.colors.$neutral3}`,
    padding: `${vars.sizes.$2}`,
    selectors: {
      '&[data-active-theme="dark"][data-theme="light"]': {
        display: 'none',
      },
      '&[data-active-theme="light"][data-theme="dark"]': {
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
