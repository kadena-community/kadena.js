// styles.css.ts

import { deviceColors } from '@/styles/tokens.css';
import { globalStyle, style } from '@vanilla-extract/css';

globalStyle('body', {
  color: 'white',
  backgroundColor: deviceColors.kadenaBlack,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
});

globalStyle('a', {
  color: 'white',
});

globalStyle('a:hover', {
  color: 'lightgray',
  textDecoration: 'none',
});

globalStyle('a:has(button)', {
  textDecoration: 'none',
  flex: 1,
});

export const mainWrapperClass = style({
  display: 'grid',
});

export const twoColumnRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '30px',
});

export const oneColumnRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '20px',
});

export const formSection = style({
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // subtle shadow for depth
});

export const verticalForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px', // increase space for better readability
});

export const formLabel = style({
  marginBottom: '5px',
  color: 'black',
  fontWeight: 'bold', // make labels bold
});

export const formInput = style({
  padding: '10px',
  border: '2px solid #ddd', // thicker border
  borderRadius: '4px',
  color: 'black',
  backgroundColor: 'white',
  ':hover': {
    borderColor: '#aaa', // change border color on hover
  },
});

export const firstColumn = style({
  width: '50%',
});

export const secondColumn = style({
  width: '50%',
  paddingLeft: '0%',
});

export const uploadContainer = style({
  border: '2px dashed #ccc',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

export const uploadImage = style({
  maxWidth: '100%',
});

export const uploadText = style({
  margin: '0',
});

export const checkboxRow = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  marginBottom: '10px',
});

export const checkboxContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

export const checkboxLabel = style({
  color: 'black',
  userSelect: 'none',
});

export const checkboxInput = style({
  width: '16px',
  height: '16px',
});
