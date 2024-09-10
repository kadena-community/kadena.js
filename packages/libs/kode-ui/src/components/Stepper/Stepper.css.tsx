import { recipe, token, tokens } from '../../styles';
import { globalStyle, style } from '../../styles/utils';

export const stepperClass = recipe({
  base: {},
  variants: {
    direction: {
      vertical: {},
      horizontal: {},
    },
  },
});

const COLORS = {
  inactive: token('color.icon.base.@disabled'),
  inactiveBorder: token('color.icon.base.@disabled'),
  inactiveBullet: token('color.icon.base.@disabled'),
  active: tokens.kda.foundation.color.text.brand.primary.default,
  activeBorder: token('color.accent.brand.primary'),
  activeBullet: token('color.accent.brand.primary'),
  valid: tokens.kda.foundation.color.text.brand.primary.default,
  validBorder: token('color.accent.brand.primary'),
  validBullet: token('color.accent.brand.primary'),
  error: tokens.kda.foundation.color.text.semantic.negative.default,
  errorBorder: token('color.icon.semantic.negative.@active'),
  errorBullet: tokens.kda.foundation.color.icon.semantic.negative['@active'],
  disabled: tokens.kda.foundation.color.text.base['@disabled'],
  disabledBorder: token('color.icon.base.@disabled'),
  disabledBullet: token('color.icon.base.@disabled'),
} as const;

export const stepClass = recipe({
  base: {
    display: 'flex',
    position: 'relative',
    paddingBlock: token('spacing.md'),
    color: COLORS.valid,
    fontSize: token('typography.fontSize.sm'),

    selectors: {
      '&:before, &:after': {
        content: '',
        position: 'absolute',
        borderColor: 'transparent',
        borderStyle: 'none',
        borderWidth: '0',
        borderInlineEndStyle: 'solid',
        borderInlineEndWidth: '1px',
        borderInlineEndColor: COLORS.validBorder,
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
          borderInlineEndColor: COLORS.inactiveBorder,
        },
      },
      active: {},
      valid: {},
      error: {
        color: COLORS.error,
        selectors: {
          '&:after': {
            borderInlineEndStyle: 'dashed',
            borderInlineEndColor: COLORS.errorBorder,
          },
        },
      },
      disabled: {
        color: COLORS.disabled,
        selectors: {
          '&:after': {
            borderInlineEndStyle: 'dashed',
            borderInlineEndColor: COLORS.disabledBorder,
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
          backgroundColor: COLORS.inactiveBullet,
        },
      [`${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.active} ~ ${stepClass.classNames.base} &`]:
        {
          backgroundColor: COLORS.disabledBullet,
        },
      [`${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.error} ~ ${stepClass.classNames.base} &`]:
        {
          backgroundColor: COLORS.disabledBullet,
        },
      [`${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.error} ~ ${stepClass.classNames.base} &,
        ${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.disabled} ~ ${stepClass.classNames.base} &`]:
        {
          backgroundColor: COLORS.disabledBullet,
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
        backgroundColor: COLORS.inactiveBullet,
      },
      active: {
        backgroundColor: COLORS.activeBullet,
      },
      valid: {
        backgroundColor: COLORS.validBullet,
      },
      error: {
        backgroundColor: COLORS.errorBullet,
      },
      disabled: {
        backgroundColor: COLORS.disabledBullet,
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
    borderColor: COLORS.disabledBorder,
  },
);
globalStyle(
  `${stepClass.classNames.variants.active.true} ~ ${stepClass.classNames.base}:after`,
  {
    borderColor: COLORS.disabledBorder,
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
  fontSize: token('typography.fontSize.xs'),
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
