import { atoms, recipe, tokens } from '@kadena/kode-ui/styles';
import { keyframes, style } from '@vanilla-extract/css';

const shimmer = keyframes({
  '100%': { transform: 'translateX(100%)' },
});

export const loadingPillClass = style([
  atoms({
    position: 'relative',
    display: 'flex',
  }),
  {
    backgroundColor: tokens.kda.foundation.color.background.input['@hover'],

    minHeight: '20px',
    height: '65%',
    overflow: 'hidden',
    selectors: {
      '&::after': {
        overflow: 'hidden',
        content: '',
        position: 'absolute',
        inset: 0,
        transform: 'translateX(-100%)',
        animation: `${shimmer} 5s infinite`,
        backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${tokens.kda.foundation.color.background.base['@focus']} 35%, rgba(0,0,0,0) 59%)`,
      },
    },
  },
]);

export const loadingVariants = recipe({
  variants: {
    variant: {
      default: [
        atoms({
          borderRadius: 'md',
        }),
        {
          width: '100%',
          maxWidth: '70%',
          minWidth: '100px',
        },
      ],
      icon: [
        atoms({
          borderRadius: 'round',
        }),
        {
          width: '30%',
          aspectRatio: '1/1',
        },
      ],
    },
  },
});
