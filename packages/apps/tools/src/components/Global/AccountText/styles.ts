import { styled } from '@kadena/react-components';
import { SystemIcon } from '@kadena/react-ui';

export const StyledAccountText = styled('div', {
  width: '100%',
});

export const StyledTitle = styled('div', {
  alignSelf: 'stretch',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: '$sm',
  fontWeight: '$medium',
});

export const StyledAccountNo = styled('div', {
  display: 'inline-block',
  wordBreak: 'break-word',
  font: '$mono',
  fontWeight: '$semiBold',
  flex: '1',
});

export const StyledAccountContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  gap: '$2',
});

export const StyledEyeOffIcon = styled(SystemIcon.EyeOffOutline, {
  width: '24px',
  height: '24px',
});

export const StyledEyeIcon = styled(SystemIcon.EyeOutline, {
  width: '24px',
  height: '24px',
});
