import { recipe } from '@kadena/kode-ui';
import { atoms, globalStyle, token } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const profileClass = recipe({
  base: [
    atoms({
      borderRadius: 'round',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'primaryFont.medium',
      cursor: 'pointer',
    }),
    {
      border: 0,
      width: '32px',
      height: '32px',
      aspectRatio: '1/1',
      color: token('color.background.base.default'),
      willChange: 'transform',
      transition: 'transform .4s ease',
      selectors: {
        '&:hover': {
          opacity: '.8',
        },
      },
    },
  ],
  variants: {
    isActive: {
      true: {
        selectors: {
          '&:after': {
            content: '',
            position: 'absolute',
            backgroundColor: token(
              'color.background.accent.primary.inverse.default',
            ),
            borderRadius: '50%',
            width: '10px',
            height: '10px',
            bottom: 0,
            right: 0,
          },
        },
      },
      false: {},
    },
  },
});

export const profileListClass = style([
  atoms({
    position: 'relative',
    padding: 'no',
    margin: 'no',
    listStyleType: 'none',
    alignItems: 'center',
    cursor: 'pointer',
    gap: 'xs',
  }),
]);

globalStyle(
  `${profileListClass}:hover  ${profileClass()}[data-hasMoreOptions="true"]`,
  {
    background: 'green',
    transform: 'translateX(0)!important',
  },
);
