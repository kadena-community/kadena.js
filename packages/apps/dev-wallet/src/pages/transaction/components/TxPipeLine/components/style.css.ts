import { recipe, style } from '@kadena/kode-ui';
import { atoms, vars } from '@kadena/kode-ui/styles';

export const statusListWrapperClass = style([
  atoms({
    borderColor: 'base.subtle',
    borderWidth: 'hairline',
    borderStyle: 'solid',
    borderRadius: 'sm',
    padding: 'md',
    flexDirection: 'column',
  }),
]);

export const iconSuccessClass = style([
  atoms({
    color: 'icon.semantic.positive.default',
  }),
]);

export const pendingClass = style({});

export const minimizedColorClass = recipe({
  base: {},
  variants: {
    status: {
      success: {
        color: vars.colors.$positiveSurface,
      },
      failure: {
        color: vars.colors.$negativeAccent,
      },
      active: {
        color: vars.colors.$positiveSurface,
      },
      paused: {
        color: vars.colors.$warningHighContrast,
      },
    },
  },
});
