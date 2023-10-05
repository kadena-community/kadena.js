import { globalStyle, style } from '@vanilla-extract/css';

export const container = style([{}]);

export const debugContainerButton = style([
  {
    marginTop: '0.5rem',
  },
]);

export const debugContainer = style([
  {
    margin: '0.5rem 0',
    backgroundColor: '#ddd',
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderWidth: '2px',
    padding: '0.5rem',
    display: 'inline-block',
  },
]);

export const tooltipContainer = style({});

globalStyle(`${tooltipContainer} div`, {
  zIndex: 2,
  backgroundColor: '#e88e00',
  borderColor: '#e88e00',
});
