import { styled, StyledComponent } from '@kadena/react-components';

export const BottomWrapper: StyledComponent<
  'div',
  { layout?: 'code' | 'default' }
> = styled('div', {
  width: '100%',

  defaultVariants: {
    layout: 'default',
  },
  variants: {
    layout: {
      default: {},
      code: {
        '@xl': {
          width: '56%',
        },
        '@2xl': {
          width: '60%',
        },
      },
    },
  },
});

export const Wrapper: StyledComponent<'div'> = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-end',
});
