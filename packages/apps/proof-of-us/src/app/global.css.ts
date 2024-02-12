import '@kadena/react-ui/global';
import { globalStyle } from '@vanilla-extract/css';

globalStyle('body', {
  color: 'white',
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

globalStyle('a', {
  color: 'white',
});

globalStyle('a:hover', {
  color: 'lightgray',
  textDecoration: 'none',
});
