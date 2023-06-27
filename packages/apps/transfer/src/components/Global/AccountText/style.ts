import { SystemIcons, styled } from '@kadena/react-components';

export const StyledTitle = styled('div', {
  alignSelf: 'strecth',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: '$sm',
});

export const StyledAccountNo = styled('div', {
  display: 'inline-block',
  wordBreak: 'break-word',
  font: '$mono',
  fontWeight: '$semiBold',
});

export const StyledAccountContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  alignSelf: 'stretch',
  gap: '$10',
});

export const StyledEyeOffIcon = styled(SystemIcons.EyeOffOutline, {
  width: '24px',
  height: '100%',
  alignSelf: 'stretch',
});

export const StyledEyeIcon = styled(SystemIcons.EyeOutline, {
  width: '24px',
  height: '24px',
});
