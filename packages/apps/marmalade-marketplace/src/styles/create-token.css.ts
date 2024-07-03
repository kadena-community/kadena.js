import { style, globalStyle } from '@vanilla-extract/css';
import { deviceColors } from '@/styles/tokens.css';

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
  marginTop: '20px',
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

export const responseMessage = style({
  margin: '20px 0',
  padding: '10px',
  borderRadius: '4px',
  backgroundColor: '#f1f1f1',
  color: 'black',
});

export const tabsContainer = style({
  display: 'flex',
  flexDirection: 'column',
  margin: '20px 0',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '8px',
});

export const formSection = style({
  margin: '20px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
});

export const verticalForm = style({
  display: 'flex',
  flexDirection: 'column',
});

export const buttonRow = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px',
});

export const buttonRowRight = style({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '20px',
});

export const textareaField = style({
  width: 100,
  height: 400,
  resize: "none",
  // box-sizing: "border-box"
});

export const container = style({
  maxWidth: 600,
  margin: '0 auto',
  padding: 20,
  backgroundColor: '#f0f0f0',
  borderRadius: 8,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

export const card = style({
  padding: 20,
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: 4,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

export const transactionDetails = style({
  marginBottom: 20,
});

export const transactionDetailsHeader = style({
  fontSize: '1.2rem',
  marginBottom: 10,
});

export const buttonContainer = style({
  marginTop: 16,
});

export const button = style({
  marginRight: 12,
});

export const formHeading = style({
  color: 'black',
});

export const errorBox = style({ 
  color: 'red', 
  backgroundColor: '#ffe6e6', 
  border: '1px solid red', 
  borderRadius: '5px', 
  padding: '10px', 
  margin: '10px 0',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px'
});


export const resultBox = style({ 
  color: 'green', 
  backgroundColor: '#e6ffe6',
  border: "1px solid green",
  borderRadius: '5px', 
  padding: '10px', 
  margin: '10px 0',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px'
});