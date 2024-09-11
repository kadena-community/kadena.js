import { recipe, token, tokens } from '../../styles';
import { globalStyle, style } from '../../styles/utils';

const COLORS = {
  inactive: token('color.icon.base.@disabled'),
  inactiveBorder: token('color.icon.base.@disabled'),
  inactiveBullet: tokens.kda.foundation.color.icon.brand.primary['@disabled'],
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
  disabledBullet: tokens.kda.foundation.color.icon.brand.primary['@disabled'],
} as const;

export const stepperClass = recipe({
  base: {
    paddingInline: '0',
  },
  variants: {
    direction: {
      vertical: {
        flexDirection: 'column',
      },
      horizontal: {
        width: '100%',
        flexDirection: 'row',
      },
    },
  },
});

export const steppContentWrapperClass = style({
  textAlign: 'center',
  selectors: {
    [`${stepperClass.classNames.variants.direction.vertical} &`]: {
      marginInlineStart: token('spacing.lg'),
    },
    [`${stepperClass.classNames.variants.direction.horizontal} &`]: {
      marginBlockStart: token('spacing.lg'),
    },
  },
});

export const steppContentClass = style({
  display: '-webkit-box!important',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textAlign: 'center',
});

export const stepClass = recipe({
  base: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    paddingBlock: token('spacing.md'),
    color: COLORS.valid,
    fontSize: token('typography.fontSize.sm'),
    selectors: {
      '&[data-isclickable="true"]': {
        cursor: 'pointer',
      },
      '&[data-isclickable="true"]:hover': {
        textDecoration: 'underline',
        opacity: '.8',
      },
      [`${stepperClass.classNames.variants.direction.horizontal} &`]: {
        flexDirection: 'column',
      },
      [`${stepperClass.classNames.variants.direction.vertical} &`]: {
        flexDirection: 'row',
      },

      '&:before, &:after': {
        content: '',
        position: 'absolute',
        borderStyle: 'solid',
        borderWidth: '0',
        borderColor: COLORS.validBorder,
      },
      [`${stepperClass.classNames.variants.direction.vertical} &:before`]: {
        transform: 'translateY(-50%) translateX(-0.5px)',
      },
      [`${stepperClass.classNames.variants.direction.vertical} &:after`]: {
        transform: 'translateY(50%) translateX(-0.5px)',
      },
      [`${stepperClass.classNames.variants.direction.vertical} &:before, ${stepperClass.classNames.variants.direction.vertical} &:after`]:
        {
          height: '50%',
          borderInlineEndWidth: '1px',
        },

      [`${stepperClass.classNames.variants.direction.horizontal} &:before`]: {
        transform: 'translateX(-50%) ',
      },
      [`${stepperClass.classNames.variants.direction.horizontal} &:after`]: {
        transform: 'translateX(50%) ',
      },
      [`${stepperClass.classNames.variants.direction.horizontal} &:before, ${stepperClass.classNames.variants.direction.horizontal} &:after`]:
        {
          width: '50%',
          borderBlockStartWidth: '1px',
        },
      [`&:last-child:after, &:first-child:before`]: {
        borderInlineEndWidth: '0',
        borderBlockStartWidth: '0',
      },
    },
  },
  variants: {
    status: {
      inactive: {
        color: COLORS.inactive,
        '&:after': {
          borderColor: COLORS.inactiveBorder,
        },
      },
      active: {},
      valid: {},
      error: {
        color: COLORS.error,
        selectors: {
          '&:after': {
            borderStyle: 'dashed',
            borderColor: COLORS.errorBorder,
          },
        },
      },
      disabled: {
        color: COLORS.disabled,
        selectors: {
          '&:after': {
            borderStyle: 'dashed',
            borderColor: COLORS.disabledBorder,
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

    zIndex: 1,
    selectors: {
      [`${stepperClass.classNames.variants.direction.vertical} &`]: {
        transform: 'translateX(-50%)',
      },
      [`${stepperClass.classNames.variants.direction.horizontal} &`]: {
        transform: 'translateY(-50%)',
      },
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
    borderStyle: 'dashed',
  },
);

export const checkClass = style({
  fontSize: token('typography.fontSize.xxs'),
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
