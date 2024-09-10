import { recipe, token } from '../../styles';
import { globalStyle, style } from '../../styles/utils';

export const stepperClass = style({});

const COLORS = {
  inactive: token('color.icon.base.@disabled'),
  active: token('color.accent.brand.primary'),
  valid: token('color.accent.brand.primary'),
  error: token('color.icon.semantic.negative.@active'),
  disabled: token('color.icon.base.@disabled'),
} as const;

export const stepClass = recipe({
  base: {
    display: 'flex',
    position: 'relative',
    paddingBlock: token('spacing.md'),
    color: COLORS.valid,

    selectors: {
      '&:before, &:after': {
        content: '',
        position: 'absolute',
        borderColor: 'transparent',
        borderStyle: 'none',
        borderWidth: '0',
        borderInlineEndStyle: 'solid',
        borderInlineEndWidth: '1px',
        borderInlineEndColor: COLORS.valid,
        height: '50%',
      },
      '&:before': {
        transform: 'translateX(-50%) translateY(-50%)',
      },
      '&:after': {
        transform: 'translateX(-50%) translateY(50%)',
      },

      '&:last-child:after, &:first-child:before': {
        borderInlineEndWidth: '0',
        height: '0',
      },
    },
  },
  variants: {
    status: {
      inactive: {
        color: COLORS.inactive,
        '&:after': {
          borderInlineEndColor: COLORS.inactive,
        },
      },
      active: {},
      valid: {},
      error: {
        color: COLORS.error,
        selectors: {
          '&:after': {
            borderInlineEndStyle: 'dashed',
            borderInlineEndColor: COLORS.error,
          },
        },
      },
      disabled: {
        color: COLORS.disabled,
        selectors: {
          '&:after': {
            borderInlineEndStyle: 'dashed',
            borderInlineEndColor: COLORS.disabled,
          },
        },
      },
    },
    active: {
      false: {},
      true: {},
    },
  },
});

export const bulletClass = recipe({
  base: {
    position: 'absolute',
    borderRadius: token('radius.round'),

    transform: 'translateX(-50%)',
    zIndex: 1,
    selectors: {
      [`${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.inactive} ~ ${stepClass.classNames.base} &, 
        ${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.valid} ~ ${stepClass.classNames.base} &`]:
        {
          backgroundColor: COLORS.inactive,
        },
      [`${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.active} ~ ${stepClass.classNames.base} &`]:
        {
          backgroundColor: COLORS.disabled,
        },
      [`${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.error} ~ ${stepClass.classNames.base} &,
        ${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.disabled} ~ ${stepClass.classNames.base} &`]:
        {
          backgroundColor: COLORS.disabled,
        },
    },
  },
  variants: {
    active: {
      false: {
        height: token('size.n2'),
        width: token('size.n2'),
      },
      true: {
        height: token('size.n4'),
        width: token('size.n4'),
      },
    },
    status: {
      inactive: {
        backgroundColor: COLORS.inactive,
      },
      active: {
        backgroundColor: COLORS.active,
      },
      valid: {
        backgroundColor: COLORS.valid,
      },
      error: {
        backgroundColor: COLORS.error,
      },
      disabled: {
        backgroundColor: COLORS.disabled,
      },
    },
  },
});

globalStyle(
  `${stepClass.classNames.variants.active.true} ~ ${stepClass.classNames.base}`,
  {
    color: COLORS.inactive,
  },
);
globalStyle(
  `${stepClass.classNames.variants.active.true} ~ ${stepClass.classNames.base}:before`,
  {
    borderColor: COLORS.disabled,
  },
);
globalStyle(
  `${stepClass.classNames.variants.active.true} ~ ${stepClass.classNames.base}:after`,
  {
    borderColor: COLORS.disabled,
  },
);

globalStyle(
  `${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.disabled} ~ ${stepClass.classNames.base},
  ${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.error} ~ ${stepClass.classNames.base}`,
  {
    color: COLORS.disabled,
  },
);

globalStyle(
  `${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.error} ~ ${stepClass.classNames.base}:after,
  ${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.error} ~ ${stepClass.classNames.base}:before,
  ${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.disabled} ~ ${stepClass.classNames.base}:after,
  ${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.disabled} ~ ${stepClass.classNames.base}:before`,
  {
    borderInlineEndStyle: 'dashed',
  },
);

export const checkClass = style({
  selectors: {
    [`${stepClass.classNames.variants.active.true} &`]: {
      display: 'none',
    },
    [`${stepClass.classNames.variants.active.true} ~ ${stepClass.classNames.base} &`]:
      {
        display: 'none',
      },
  },
});
