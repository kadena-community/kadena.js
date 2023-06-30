import { styled } from '@kadena/react-components';

export const StyledInfoTitle = styled('h3', {
  marginBottom: '2%',
  textAlign: 'center',
});

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
});

export const StyledInfoItemLine = styled('div', {
  display: 'inline-block',
  wordBreak: 'break-word',
  font: '$mono',
  fontWeight: '$semiBold',
});

export const StyledInfoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '$4',
  flex: '1 0 0',
});
