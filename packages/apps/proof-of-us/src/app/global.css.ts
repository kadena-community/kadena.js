import '@kadena/react-ui/global';
import { globalStyle } from '@vanilla-extract/css';

globalStyle('body', {
  backgroundColor: '#081320',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  '@media': {
    '(orientation: portrait)': {
      backgroundImage: `url("/assets/bg-portrait.png")`,
    },
    '(orientation: landscape)': {
      backgroundImage: `url("/assets/bg-landscape.jpg")`,
    },
  },
});
