import { darkTheme, styled, StyledComponent } from '@kadena/react-components';

export const StyledInlineCode: StyledComponent<'code'> = styled('code', {
  padding: 'calc($1 / 4) $1',
  backgroundColor: '$neutral2',
  borderRadius: '$sm',
});

export const StyledCodeWrapper: StyledComponent<'div'> = styled('div', {
  backgroundColor: '$neutral2',
  borderLeft: '4px solid $borderColor',
  borderRadius: '$sm 0px 0px $sm',
  fontSize: '$sm',
  fontFamily: '$mono',
  lineHeight: '$code',
  margin: '$5 0',

  '& code': {
    wordBreak: 'break-all',
  },
  '& [data-rehype-pretty-code-title]': {
    display: 'flex',
    alignItems: 'center',
    fontFamily: '$main',
    background: '$neutral3',
    padding: '$2',

    '&[data-language]': {
      '&::before': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 $2',
        color: '$background',
        backgroundColor: '$primaryContrast',
        borderRadius: '$sm',
        width: '$6',
        height: '$6',
      },
    },
    '&[data-language="pact"]': {
      '&::before': {
        content: 'P',
      },
    },
    '&[data-language="lisp"]': {
      '&::before': {
        content: 'L',
      },
    },
    '&[data-language="typescript"], &[data-language="ts"]': {
      '&::before': {
        content: 'TS',
      },
    },
    '&[data-language="javascript"], &[data-language="ks"]': {
      '&::before': {
        content: 'JS',
      },
    },
    '&[data-language="yaml"]': {
      '&::before': {
        content: 'Y',
      },
    },
    '&[data-language="json"]': {
      '&::before': {
        content: 'J',
      },
    },
    '&[data-language="bash"]': {
      '&::before': {
        content: 'B',
      },
    },
    '&[data-language="shell"], &[data-language="sh"]': {
      '&::before': {
        content: 'S',
      },
    },
  },

  '& [data-theme="dark"]': {
    display: 'none',
  },

  [`.${darkTheme} &`]: {
    '& [data-theme="light"]': {
      display: 'none',
    },
    '& [data-theme="dark"]': {
      display: 'grid',

      '&[data-rehype-pretty-code-title]': {
        display: 'flex',
      },
    },
  },
});

export const StyledCode: StyledComponent<'code'> = styled('code', {
  counterReset: 'line',
  whiteSpace: 'break-spaces',
  fontFamily: '$mono',

  '& *': {
    fontFamily: '$mono',
  },

  '& > .line::before': {
    counterIncrement: 'line',
    content: 'counter(line)',
    overflowWrap: 'normal',

    /* Other styling */
    display: 'inline-block',
    width: '1rem',
    marginRight: '$4',
    marginLeft: '$4',
    textAlign: 'right',
    fontSize: '$sm',
    color: '$neutral3',
  },

  '&[data-line-numbers-max-digits="2"] > .line::before': {
    width: '2rem',
  },

  '&[data-line-numbers-max-digits="3"] > .line::before': {
    width: '3rem',
  },

  '&  .word': {
    background: '$neutral3',
    outline: 'calc($sizes$1 / 2) solid $neutral3',
    borderRadius: '$xs',
  },
});
