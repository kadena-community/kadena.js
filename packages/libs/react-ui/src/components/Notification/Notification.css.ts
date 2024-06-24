import { createVar } from '@vanilla-extract/css';
import { recipe, style, token } from '../../styles';

const iconColorVar = createVar();

export const notificationRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: token('spacing.md'),
    gap: token('spacing.sm'),
    width: '100%',
    backdropFilter: 'blur(12px)',
  },
  variants: {
    intent: {
      info: {
        backgroundColor: token('color.background.semantic.info.subtle'),
        borderColor: token('color.background.semantic.info.default'),
        color: token(`color.text.semantic.info.default`),
        vars: {
          [iconColorVar]: token('color.icon.semantic.info.default'),
        },
      },
      positive: {
        backgroundColor: token('color.background.semantic.positive.subtle'),
        borderColor: token(`color.border.semantic.positive.default`),
        color: token(`color.text.semantic.positive.default`),
        vars: {
          [iconColorVar]: token('color.icon.semantic.positive.default'),
        },
      },
      warning: {
        backgroundColor: token('color.background.semantic.warning.subtle'),
        borderColor: token(`color.border.semantic.warning.default`),
        color: token(`color.text.semantic.warning.default`),
        vars: {
          [iconColorVar]: token('color.icon.semantic.warning.default'),
        },
      },
      negative: {
        backgroundColor: token('color.background.semantic.negative.subtle'),
        borderColor: token(`color.border.semantic.negative.default`),
        color: token(`color.text.semantic.negative.default`),
        vars: {
          [iconColorVar]: token('color.icon.semantic.negative.default'),
        },
      },
    },
  },
  defaultVariants: {
    intent: 'info',
  },
});

export const closeButtonClass = style({
  marginInlineStart: 'auto',
  padding: 0,
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: iconColorVar,
});

export const borderClass = style({
  borderStyle: 'solid',
  borderWidth: '0',
  borderLeftWidth: token('border.width.thick'),
});

export const contentClassRecipe = recipe({
  base: {
    display: 'flex',
    fontSize: token('typography.fontSize.base'),
    gap: token('spacing.xs'),
    maxWidth: token('layout.content.maxWidth'),
    marginBlockStart: token('spacing.xxs'),
  },
  variants: {
    type: {
      inline: {
        flexDirection: 'row',
      },
      inlineStacked: {
        flexDirection: 'column',
      },
      stacked: {
        flexDirection: 'column',
      },
    },
  },
  defaultVariants: {
    type: 'stacked',
  },
});

export const titleClass = style({
  fontSize: token('typography.fontSize.base'),
  fontWeight: token('typography.weight.secondaryFont.bold'),
  marginBlockEnd: token('spacing.xs'),
});

export const iconClass = style({
  flexShrink: 0,
  color: iconColorVar,
  width: token('icon.size.base'),
  height: token('icon.size.base'),
});

export const actionsContainerClass = style({
  marginBlockStart: token('spacing.md'),
  display: 'flex',
  justifyContent: 'flex-start',
  gap: token('spacing.xl'),
});

/*
  Action Button Styles
*/

const actionIconVar = createVar();

export const actionButtonRecipe = recipe({
  base: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    margin: 0,
    padding: 0,
    fontSize: token('typography.fontSize.base'),
    fontWeight: token('typography.weight.secondaryFont.bold'),
    cursor: 'pointer',
  },
  variants: {
    intent: {
      info: {
        color: token(`color.text.semantic.info.default`),
        vars: {
          [actionIconVar]: token('color.icon.semantic.info.default'),
        },
      },
      positive: {
        color: token(`color.text.semantic.positive.default`),
        vars: {
          [actionIconVar]: token('color.icon.semantic.positive.default'),
        },
      },
      warning: {
        color: token(`color.text.semantic.warning.default`),
        vars: {
          [actionIconVar]: token('color.icon.semantic.warning.default'),
        },
      },
      negative: {
        color: token(`color.text.semantic.negative.default`),
        vars: {
          [actionIconVar]: token('color.icon.semantic.negative.default'),
        },
      },
    },
  },
});

export const actionButtonIconClass = style({
  marginInlineStart: token('spacing.sm'),
  color: actionIconVar,
});
