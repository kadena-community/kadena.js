import { atoms, tokens } from '@kadena/kode-ui/styles';
import { createVar, style } from '@vanilla-extract/css';

export const percentageValueVar = createVar();

export const chainBalanceWrapperClass = style([
  atoms({
    position: 'relative',
    borderStyle: 'solid',
    borderRadius: 'sm',
    borderWidth: 'hairline',
    borderColor: 'base.subtle',
    paddingBlock: 'md',
    paddingInline: 'lg',
    zIndex: 0,
  }),
  {
    selectors: {
      '&:before': {
        top: 0,
        left: 0,
        borderStartStartRadius: tokens.kda.foundation.radius.sm,
        borderEndStartRadius: tokens.kda.foundation.radius.sm,
        content: '',
        position: 'absolute',
        background: tokens.kda.foundation.color.background.brand.primary.subtle,
        height: '100%',
        width: percentageValueVar,
        zIndex: 0,
      },
      // '.fund-button': {
      //   display: 'block',
      // },
    },
  },
]);

export const fundButtonClass = style({
  opacity: 0,
  selectors: {
    [`${chainBalanceWrapperClass}:hover &`]: {
      opacity: 1,
    },
    '&:focus': {
      opacity: 1,
    },
  },
});

export const chainTextBaseClass = style([
  atoms({
    zIndex: 1,
  }),
]);
export const chainTextSubtleClass = style([
  atoms({
    color: 'text.gray.default',
  }),
]);

export const chainTextDisabledClass = style({ opacity: '.6' });
export const chainTextLargeClass = style([
  atoms({
    fontSize: 'lg',
  }),
]);

export const chainInputClass = style({
  direction: 'rtl',
});
