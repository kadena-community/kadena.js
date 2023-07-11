import { styled } from '@kadena/react-components';

export const StyledInfoItem = styled('div', {
  display: 'grid',
  padding: '$3',
  gridTemplateColumns: 'auto 1fr',
  gap: '$4',
  marginTop: '4%',
  background: 'rgba(71, 79, 82, 0.7)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
  flexDirection: 'column',
  alignItems: 'flex-start',
  fontSize: '$sm',
});

export const StyledInfoItemTitle = styled('div', {
  alignSelf: 'strecth',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: '$sm',
  fontWeight: '$medium',
});

export const StyledInfoItemLine = styled('div', {
  display: 'inline-block',
  wordBreak: 'break-word',
  font: '$mono',
  fontWeight: '$normal',
});

export const StyledInfoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '$4',
  flex: '1 0 0',
});

export const StyledWarningContainer = styled('div', {
  display: 'inline-block',
  flexDirection: 'column',
  alignItems: 'flex-start',
  fontWeight: '$normal',
  fontSize: '$xs',
  variants: {
    typedMessage: {
      mild: {
        color: '$warningContrast',
      },
      severe: {
        color: '$negativeContrast',
      },
    },
  },
});

export const StyledContentContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
});
