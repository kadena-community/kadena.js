import { ComplexStyleRule, createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { atoms, token } from '../../styles';

const iconColorVar = createVar();

const customStyle = (rule: ComplexStyleRule, debugId?: string) => {
  const flattenedRule = Array.isArray(rule) ? Object.assign({}, ...rule) : rule;

  return style({ '@layer': { default: flattenedRule } }, debugId);
};

export const notificationRecipe = recipe({
  base: [
    atoms({
      display: 'flex',
      alignItems: 'flex-start',
      padding: 'md',
      gap: 'sm',
      width: '100%',
    }),
    {
      backdropFilter: 'blur(12px)',
    },
  ],
  variants: {
    intent: {
      info: [
        atoms({
          backgroundColor: 'semantic.info.subtle',
          borderColor: `semantic.info.default`,
          color: `text.semantic.info.default`,
        }),
        {
          vars: {
            [iconColorVar]: token('color.icon.semantic.info.default'),
          },
        },
      ],
      positive: [
        atoms({
          backgroundColor: 'semantic.positive.subtle',
          borderColor: `semantic.positive.default`,
          color: `text.semantic.positive.default`,
        }),
        {
          vars: {
            [iconColorVar]: token('color.icon.semantic.positive.default'),
          },
        },
      ],
      warning: [
        atoms({
          backgroundColor: 'semantic.warning.subtle',
          borderColor: `semantic.warning.default`,
          color: `text.semantic.warning.default`,
        }),
        {
          vars: {
            [iconColorVar]: token('color.icon.semantic.warning.default'),
          },
        },
      ],
      negative: [
        atoms({
          backgroundColor: 'semantic.negative.subtle',
          borderColor: `semantic.negative.default`,
          color: `text.semantic.negative.default`,
        }),
        {
          vars: {
            [iconColorVar]: token('color.icon.semantic.negative.default'),
          },
        },
      ],
    },
  },
  defaultVariants: {
    intent: 'info',
  },
});

export const closeButtonClass = customStyle([
  atoms({
    marginInlineStart: 'auto',
    padding: 'no',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  }),
  {
    color: iconColorVar,
  },
]);



export const borderClass = customStyle([
  atoms({
    borderStyle: 'solid',
  }),
  {
    borderWidth: '0',
    borderLeftWidth: token('border.width.thick'),
  },
]);

export const contentClassRecipe = recipe({
  base: [
    atoms({
      display: 'flex',
      fontSize: 'base',
      gap: 'xs',
      maxWidth: 'content.maxWidth',
      marginBlockStart: 'xxs',
    }),
  ],
  variants: {
    type: {
      inline: [
        atoms({
          flexDirection: 'row',
        }),
      ],
      inlineStacked: [
        atoms({
          flexDirection: 'column',
        }),
      ],
      stacked: [
        atoms({
          flexDirection: 'column',
        }),
      ],
    },
  },
  defaultVariants: {
    type: 'stacked',
  },
});

export const titleClass = style([
  atoms({
    fontSize: 'base',
    fontWeight: 'secondaryFont.bold',
    marginBlockEnd: 'xs',
  }),
]);

export const iconClass = style([
  atoms({
    flexShrink: 0,
  }),
  {
    color: iconColorVar,
    width: token('icon.size.base'),
    height: token('icon.size.base'),
  },
]);

export const actionsContainerClass = style([
  atoms({
    marginBlockStart: 'md',
    display: 'flex',
    justifyContent: 'flex-start',
    gap: 'xl',
  }),
]);

/*
  Action Button Styles
*/

const actionIconVar = createVar();

export const actionButtonRecipe = recipe({
  base: atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    margin: 'no',
    padding: 'no',
    fontSize: 'base',
    fontWeight: 'secondaryFont.bold',
    cursor: 'pointer',
  }),
  variants: {
    intent: {
      info: [
        atoms({
          color: `text.semantic.info.default`,
        }),
        {
          vars: {
            [actionIconVar]: token('color.icon.semantic.info.default'),
          },
        },
      ],
      positive: [
        atoms({
          color: `text.semantic.positive.default`,
        }),
        {
          vars: {
            [actionIconVar]: token('color.icon.semantic.positive.default'),
          },
        },
      ],
      warning: [
        atoms({
          color: `text.semantic.warning.default`,
        }),
        {
          vars: {
            [actionIconVar]: token('color.icon.semantic.warning.default'),
          },
        },
      ],
      negative: [
        atoms({
          color: `text.semantic.negative.default`,
        }),
        {
          vars: {
            [actionIconVar]: token('color.icon.semantic.negative.default'),
          },
        },
      ],
    },
  },
});

export const actionButtonIconClass = style([
  atoms({
    marginInlineStart: 'sm',
  }),
  {
    color: actionIconVar,
  },
]);
