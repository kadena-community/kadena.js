import { styled } from '@/config/stitches.config';
import { Chain, ChevronLeft } from '@/resources/svg/generated';
import Link from 'next/link';

export const StyledLayout = styled('div', {
  background: `url("/images/slide-3x.png") no-repeat center center fixed`,
  minHeight: '100vh',
});

export const StyledBack = styled(Link, {
  width: '25%',
  textAlign: 'left',
  fontSize: '1rem',
  cursor: 'pointer',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
});

export const StyledChevronLeft = styled(ChevronLeft, {
  marginRight: '16px',
});

export const StyledHeaderContainer = styled('header', {
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  color: 'white',
});

export const StyledHeaderLogoWalletContent = styled('div', {
  maxHeight: '100px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

export const StyledHeaderText = styled('div', {
  textAlign: 'left',
  marginLeft: '16px',
});

export const StyledIconImage = styled(Chain, {
  width: '10%',
  marginLeft: '8px',
});

export const StyledMainLayout = styled('div', {
  padding: '40px',
  color: 'white',
});

export const StyledLogoTextContainer = styled('div', {
  display: 'flex',
  width: '60%',
});

export const StyledTextBold = styled('div', {
  margin: '0 0 16px 10px',
  fontWeight: 'bold',
  fontSize: '2rem',
});

export const StyledTextNormal = styled('div', {
  margin: '0 0 10px 10px',
  fontSize: '1rem',
});

export const StyledTitleContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flexStart',
  alignItems: 'center',
  margin: '2rem 0',
  gap: '$16',
});

export const StyledWalletNotConnected = styled('div', {
  width: '20%',
  height: '40px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '4px 0',
  gap: '4px',

  background: 'rgba(25, 77, 0, 0.8)',
  borderRadius: '2px',

  fontSize: '1rem',
});

export const StyledTitle = styled('h2', {
  fontSize: '2rem',
  fontWeight: 'normal',
  width: '75%',
});
