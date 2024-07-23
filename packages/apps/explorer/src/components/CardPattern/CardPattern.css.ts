import { atoms, responsiveStyle, token } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

// NOTE: Padding is applied via this container instead of margin to the container to avoid margin collapse with the body
export const paddingContainer = style(
  responsiveStyle({
    md: {
      paddingBlock: token('size.n32'),
    },
  }),
);

export const container = style([
  atoms({
    borderRadius: 'md',
    padding: 'xl',
    backgroundColor: 'layer.default',
  }),
  {
    ...responsiveStyle({
      md: {
        border: token('border.hairline'),
        width: '42rem',
        marginInlineStart: '50%',
        transform: 'translateX(-50%)',
      },
    }),
  },
]);

export const bodyContent = style([
  { marginBlockStart: token('spacing.xl'), flex: 1.5 },
  {
    ...responsiveStyle({
      md: {
        marginBlockStart: token('size.n25'),
      },
    }),
    selectors: {
      "&[data-layout='no-visual']": responsiveStyle({
        md: {
          marginBlockStart: token('size.n10'),
        },
      }),
    },
  },
]);
