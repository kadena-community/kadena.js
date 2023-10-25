import { globalStyle, style } from '@vanilla-extract/css';

export const container = style([
  {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-around',
    justifyContent: 'center',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
]);

globalStyle(`${container} > div`, {
  flexBasis: '2.5%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#33263f',
});
