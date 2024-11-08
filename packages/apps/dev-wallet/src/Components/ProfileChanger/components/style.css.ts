import {
  atoms,
  globalStyle,
  recipe,
  style,
  token,
} from '@kadena/kode-ui/styles';

export const profileClass = recipe({
  base: {
    borderRadius: token('radius.round'),
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontWeight: token('typography.weight.primaryFont.medium'),

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
