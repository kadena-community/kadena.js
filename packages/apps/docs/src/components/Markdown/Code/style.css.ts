import { getClassName } from '@/utils/getClassName';
import { atoms, darkThemeClass, tokens } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';
import { headerClass } from '../Heading/styles.css';
import { paragraphWrapperClass } from '../Paragraph/styles.css';

export const inlineCode = style([
  atoms({
    borderRadius: 'sm',
    backgroundColor: 'semantic.info.default',
    color: 'text.semantic.info.default',
    marginInlineStart: 'xs',
    marginInlineEnd: 'xs',
    fontFamily: 'monospaceFont',
  }),
  {
    padding: `calc(${tokens.kda.foundation.spacing.xs} / 4) ${tokens.kda.foundation.spacing.xs}`,
    fontSize: 'smaller',
    fontWeight: 'bolder',
  },
]);

// CONTENT + INLINE CODE
// CONTENT + INLINE CODE

globalStyle(
  `article ${getClassName(headerClass)} ${getClassName(inlineCode)},
  article
  h1${getClassName(headerClass)} +
  ${getClassName(paragraphWrapperClass)} ${getClassName(inlineCode)}`,
  {
    paddingInlineStart: tokens.kda.foundation.spacing.sm,
    paddingInlineEnd: tokens.kda.foundation.spacing.sm,
  },
);

globalStyle(
  `
  article ${getClassName(paragraphWrapperClass)} ${getClassName(inlineCode)},
  article pre ${getClassName(inlineCode)},
  article ul ${getClassName(inlineCode)},
  article ol ${getClassName(inlineCode)}
  `,
  {
    paddingInlineStart: tokens.kda.foundation.spacing.xs,
    paddingInlineEnd: tokens.kda.foundation.spacing.xs,
    paddingBlockStart: 0,
    paddingBlockEnd: 0,
  },
);

export const codeWrapper = style([
  atoms({
    fontSize: 'sm',
    fontFamily: 'monospaceFont',
    lineHeight: 'base',
    marginInline: 'no',
    marginBlock: 'xxxl',
    borderRadius: 'lg',
  }),
  {
    backgroundColor: tokens.kda.foundation.color.palette.blue.n100,
    overflow: 'hidden',
    wordBreak: 'break-all',
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: tokens.kda.foundation.color.palette.blue.n0,
      },
    },
  },
]);

export const code = style([
  atoms({
    whiteSpace: 'break-spaces',
    fontFamily: 'monospaceFont',
    display: 'none',
    position: 'relative',
  }),
  {
    paddingBlock: tokens.kda.foundation.size.n3,
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
        width: tokens.kda.foundation.spacing.xxxl,
        background: tokens.kda.foundation.color.palette.blue.n90,
        zIndex: 0,
        opacity: 0.6,
      },

      [`${darkThemeClass} &::before`]: {
        backgroundColor: tokens.kda.foundation.color.palette.blue.n10,
      },
    },
  },
]);

export const codeLine = style([
  atoms({
    width: '100%',
    fontFamily: 'monospaceFont',
    zIndex: 1,
    paddingInlineEnd: 'md',
    display: 'inline-flex',
  }),
  {
    cursor: 'default',
    selectors: {
      '&:hover': {
        background: tokens.kda.foundation.color.neutral.n100,
      },
      '&::marker': {
        content: '',
      },
      '&::before': {
        counterIncrement: 'line',
        content: 'counter(line)',
        overflowWrap: 'normal',
        wordBreak: 'keep-all',
        display: 'inline-flex',
        width: '1rem',
        marginInlineEnd: `${tokens.kda.foundation.spacing.md}`,
        marginInlineStart: `${tokens.kda.foundation.spacing.md}`,
        marginBlockStart: '1px', //hack, this just aligns the number the best. with vars or display: flex. the alignment is of
        textAlign: 'right',
        fontSize: tokens.kda.foundation.typography.fontSize.sm,
        color: tokens.kda.foundation.color.neutral.n0,
        zIndex: 1,
      },
      [`${darkThemeClass} &:hover`]: {
        background: tokens.kda.foundation.color.neutral.n0,
      },
      [`${darkThemeClass} &::before`]: {
        color: tokens.kda.foundation.color.neutral.n100,
      },
    },
  },
]);

globalStyle(`code span`, {
  fontFamily: tokens.kda.foundation.typography.family.monospaceFont,
  wordBreak: 'break-word',
});

globalStyle(`code span::selection`, {
  background: tokens.kda.foundation.color.palette.blue.n80,
});
globalStyle(`${darkThemeClass} code span::selection`, {
  background: tokens.kda.foundation.color.palette.blue.n20,
});

globalStyle(
  `ul > li
  ${getClassName(codeWrapper)},
  ol > li
  ${getClassName(codeWrapper)}
  `,
  {
    margin: 0,
    marginBlockStart: tokens.kda.foundation.spacing.md,
    marginBlockEnd: tokens.kda.foundation.spacing.lg,
  },
);

export const codeTitle = style([
  atoms({
    display: 'none',
    alignItems: 'center',
    fontFamily: 'secondaryFont',
    fontWeight: 'secondaryFont.bold',
    textTransform: 'capitalize',
    padding: 'sm',
    width: '100%',
  }),
  {
    backgroundColor: tokens.kda.foundation.color.palette.blue.n70,
    color: tokens.kda.foundation.color.neutral.n0,
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
        margin: `0 ${tokens.kda.foundation.spacing.sm}`,
        color: tokens.kda.foundation.color.neutral.n0,
        backgroundColor: tokens.kda.foundation.color.palette.blue.n90,
        borderRadius: tokens.kda.foundation.radius.sm,
        width: tokens.kda.foundation.spacing.lg,
        height: tokens.kda.foundation.spacing.lg,
        fontFamily: tokens.kda.foundation.typography.family.monospaceFont,
        fontWeight: 'bold',
        fontSize: 'smaller',
      },
      [`${darkThemeClass} &`]: {
        backgroundColor: tokens.kda.foundation.color.palette.blue.n30,
        color: tokens.kda.foundation.color.neutral.n100,
      },
      [`${darkThemeClass} &[data-language]::before`]: {
        color: tokens.kda.foundation.color.neutral.n100,
        backgroundColor: tokens.kda.foundation.color.palette.blue.n10,
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

export const okCopiedClass = style([
  atoms({
    color: 'icon.semantic.positive.inverse.default',
  }),
  {
    selectors: {
      [`${darkThemeClass} &`]: {
        color: tokens.kda.foundation.color.icon.semantic.positive.default,
      },
    },
  },
]);

export const mermaidClass = style({});

export const copyButtonClass = style({
  color: tokens.kda.foundation.color.neutral.n0,
  opacity: '.8',
  selectors: {
    [`${darkThemeClass} &`]: {
      color: tokens.kda.foundation.color.neutral.n100,
    },
    '&:hover': {
      opacity: '.6',
      background: 'transparent',
    },
  },
});

globalStyle(`${code}${mermaidClass}::before`, {
  backgroundColor: 'transparent',
});
globalStyle(`${code}${mermaidClass}::before`, {
  backgroundColor: 'transparent',
});
