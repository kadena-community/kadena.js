import { atoms } from '@theme/atoms.css';
import { tokens } from '@theme/tokens/contract.css';
import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const iconColorVar = createVar();

const semanticColors = ['info', 'positive', 'warning', 'negative'] as const;
type SemanticColor = (typeof semanticColors)[number];

export const notificationRecipe = recipe({
  base: [
    atoms({
      display: 'flex',
      alignItems: 'flex-start',
      padding: 'md',
      gap: 'sm',
      width: '100%',
    }),
  ],
  variants: {
    intent: semanticColors.reduce(
      (acc, color) => {
        acc[color] = [
          atoms({
            backgroundColor: `semantic.${color}.default`,
            borderColor: `semantic.${color}.default`,
            color: `text.semantic.${color}.default`,
          }),
          {
            vars: {
              [iconColorVar]:
                tokens.kda.foundation.color.icon.semantic[color]?.default,
            },
          },
        ];
        return acc;
      },
      {} as Record<(typeof semanticColors)[number], any>,
    ),
    displayStyle: {
      bordered: [
        atoms({
          borderStyle: 'solid',
          borderWidth: 'hairline',
          borderRadius: 'sm',
        }),
        {
          borderLeftWidth: tokens.kda.foundation.border.width.thick,
        },
      ],
      borderless: [],
    },
  },
  defaultVariants: {
    intent: 'info',
    displayStyle: 'bordered',
  },
});

export const closeButtonClass = style([
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

export const contentClass = style([
  atoms({
    fontSize: 'base',
    gap: 'xs',
    maxWidth: 'content.maxWidth',
    marginBlockStart: 'xxs',
  }),
]);

export const titleClass = style([
  atoms({
    fontSize: 'base',
    fontWeight: 'bodyFont.bold',
    marginBlockEnd: 'xs',
  }),
]);

export const iconClass = style([
  atoms({
    flexShrink: 0,
  }),
  {
    color: iconColorVar,
    width: tokens.kda.foundation.icon.size.base,
    height: tokens.kda.foundation.icon.size.base,
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

const actionButtonBase = atoms({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
  border: 'none',
  margin: 'no',
  padding: 'no',
  fontSize: 'base',
  fontWeight: 'bodyFont.bold',
  cursor: 'pointer',
});

const actionButtonColors: Record<SemanticColor, SemanticColor> =
  semanticColors.reduce((acc: any, color) => {
    acc[color] = color;
    return acc;
  }, {});

export const actionButtonIntentVariants = styleVariants(
  actionButtonColors,
  (color) => {
    return [
      actionButtonBase,
      atoms({
        color: `text.semantic.${color}.default`,
      }),
      {
        vars: {
          [actionIconVar]:
            tokens.kda.foundation.color.icon.semantic[color]?.default,
        },
      },
    ];
  },
);

export const actionButtonIconClass = style([
  atoms({
    marginInlineStart: 'sm',
  }),
  {
    color: actionIconVar,
  },
]);
