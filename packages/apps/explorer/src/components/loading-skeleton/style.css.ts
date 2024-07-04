import { atoms, tokens } from '@kadena/kode-ui/styles';
import { keyframes, style } from '@vanilla-extract/css';

const shimmer = keyframes({
  '100%': { transform: 'translateX(100%)' },
});

export const loadingPillClass = style([
  atoms({
    position: 'relative',
    display: 'flex',
    borderRadius: 'md',
    marginInline: 'lg',
  }),
  {
    backgroundColor: tokens.kda.foundation.color.background.input['@hover'],
    width: '100%',
    maxWidth: '70%',
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
