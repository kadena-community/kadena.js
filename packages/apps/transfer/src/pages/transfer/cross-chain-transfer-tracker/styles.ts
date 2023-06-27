import { FromIconActive } from '@/resources/svg/generated';
import { styled } from '@kadena/react-components';

export const StyledMainContent = styled('main', {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '$16',
});
export const StyledFormButton = styled('div', {
  marginTop: '16px',
  // display: 'flex',
  // padding: '8px 16px',
  alignItems: 'center',
  gap: '$8',
});
export const StyledForm = styled('form', {
  width: '75%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});
export const StyledSideContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});
export const StyledAccountForm = styled('div', {
  padding: '16px',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
  '> *': {
    mb: '$8 ',
  },
  alignSelf: 'stretch',
});

export const StyledFormHeader = styled('div', {
  display: 'flex',
  padding: '24px 40px 0px 40px',
  alignItems: 'flex-start',
  gap: '8px',
  alignSelf: 'stretch',
});

export const StyledInfoBox = styled('div', {
  fontSize: '1rem',
  padding: '8px',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
  alignSelf: 'stretch',
  width: '40%',
});

export const StyledInfoTitle1 = styled('h3', {
  marginBottom: '2%',
  textAlign: 'center',
});

export const StyledInfoItem1 = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: '$4',
  marginTop: '4%',
  fontSize: '0.75rem',
  background: 'rgba(71, 79, 82, 0.7)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '$3',
});

export const StyledInfoItemTitle1 = styled('div', {
  alignSelf: 'strecth',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: '$sm',
});

export const StyledInfoItemLine1 = styled('div', {
  display: 'inline-block',
  wordBreak: 'break-word',
  font: '$mono',
  fontWeight: '$semiBold',
});

export const StyledSmallLogo = styled(FromIconActive, {
  marginBottom: '$5',
});
