import { style } from '@vanilla-extract/css';

export const wizardContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#1e1e1e',
  color: '#ffffff',
  height: '100vh',
});

export const wizardSteps = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: '20px',
});

export const wizardStep = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
});

export const circle = style({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: '#ffffff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '8px',
  fontSize: '14px',
  color: '#1e1e1e',
});

export const title = style({
  color: '#ffffff',
  fontSize: '14px',
});

export const activeCircle = style({
  backgroundColor: '#4caf50',
  color: '#ffffff',
});

export const activeTitle = style({
  color: '#4caf50',
});

export const line = style({
  position: 'absolute',
  top: '12px',
  left: '50%',
  width: '100%',
  height: '2px',
  backgroundColor: '#ffffff',
  zIndex: -1,
});

export const lastChildLine = style({
  display: 'none',
});

export const wizardButtons = style({
  display: 'flex',
  gap: '10px',
});

export const wizardButton = style({
  padding: '10px 20px',
  backgroundColor: '#4caf50',
  border: 'none',
  color: '#ffffff',
  cursor: 'pointer',
});

export const disabledButton = style({
  backgroundColor: '#9e9e9e',
  cursor: 'not-allowed',
});
