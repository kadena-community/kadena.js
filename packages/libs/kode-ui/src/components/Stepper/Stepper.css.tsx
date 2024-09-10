import { recipe, token } from '../../styles';
import { globalStyle, style } from '../../styles/utils';

export const stepperClass = style({});

export const stepClass = recipe({
  base: {
    display: 'flex',
    position: 'relative',
    paddingBlock: token('spacing.md'),
    color: token('color.text.brand.primary.default'),

    selectors: {
      '&:before, &:after': {
        content: '',
        position: 'absolute',
        borderColor: 'transparent',
        borderStyle: 'none',
        borderWidth: '0',
        borderInlineEndStyle: 'solid',
        borderInlineEndWidth: '1px',
        borderInlineEndColor: token(
          'color.background.accent.primary.inverse.default',
        ),
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
      inactive: {},
      active: {},
      valid: {},
      error: {
        selectors: {
          '&:after': {
            borderInlineEndStyle: 'dashed',
            borderInlineEndColor: token('color.icon.semantic.negative.@active'),
          },
        },
      },
      disabled: {
        selectors: {
          '&:after': {
            borderInlineEndStyle: 'dashed',
            borderInlineEndColor: token('color.icon.base.@disabled'),
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

globalStyle(
  `${stepClass.classNames.variants.active.true} ~ ${stepClass.classNames.base}`,
  {
    color: token('color.text.gray.default'),
  },
);
globalStyle(
  `${stepClass.classNames.variants.active.true} ~ ${stepClass.classNames.base}:before`,
  {
    borderColor: token('color.icon.brand.primary.@disabled'),
  },
);
globalStyle(
  `${stepClass.classNames.variants.active.true} ~ ${stepClass.classNames.base}:after`,
  {
    borderColor: token('color.icon.brand.primary.@disabled'),
  },
);

export const bulletClass = recipe({
  base: {
    position: 'absolute',
    borderRadius: token('radius.round'),

    transform: 'translateX(-50%)',
    zIndex: 1,
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
        backgroundColor: token('color.icon.base.@disabled'),
      },
      active: {
        backgroundColor: token('color.accent.brand.primary'),
      },
      valid: {
        backgroundColor: token('color.accent.brand.primary'),
      },
      error: {
        backgroundColor: token('color.icon.semantic.negative.@active'),
      },
      disabled: {
        backgroundColor: token('color.icon.base.@disabled'),
      },
    },
  },
});

globalStyle(
  `${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.active} ~ ${stepClass.classNames.base} ${bulletClass.classNames.base}`,
  {
    backgroundColor: token('color.icon.base.@disabled'),
  },
);

globalStyle(
  `${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.error} ~ ${stepClass.classNames.base} ${bulletClass.classNames.base}`,
  {
    backgroundColor: token('color.icon.base.@disabled'),
  },
);

globalStyle(
  `${stepClass.classNames.variants.active.true}${stepClass.classNames.variants.status.disabled} ~ ${stepClass.classNames.base} ${bulletClass.classNames.base}`,
  {
    backgroundColor: token('color.icon.base.@disabled'),
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
