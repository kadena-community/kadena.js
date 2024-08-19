import { style } from '@vanilla-extract/css';
import { tokens, token } from '@kadena/kode-ui/styles';

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

export const formContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: token('spacing.n4'),
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
  justifyContent: 'space-between',
  margin: `${token('spacing.n6')} 15% 0`,
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

// export const container = style({
//   maxWidth: 600,
//   margin: '0 auto',
//   padding: 20,
//   backgroundColor: '#f0f0f0',
//   borderRadius: 8,
//   boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
// });

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


export const checkboxStyle = style({
  flex: '1 1 50%',
  boxSizing: 'border-box',
  padding: '5px',
})

export const container = style({
  margin: '160px 15% 0',
  backgroundColor: token('color.background.layer.default'),
  borderRadius: token(`radius.sm`),
  border: `1px solid ${token(`color.border.base.subtle`)}`,
});

export const buttonRowContainer = style({
  margin: `${token('spacing.n6')} 15% 0`,
  justifyContent: 'space-between',
});

export const propertyContainer = style({
  display: 'flex',
  marginBottom: '10px',
});

export const propertyLabel = style({
  flex: '1',
});

export const propertyValue = style({
  flex: '2',
});

export const offerContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: token('spacing.n4'),
});
