import { styled } from '@kadena/react-components';

import { KLogoComponent } from '@/resources/svg/generated';
import Link from 'next/link';

export const StyledHomeContainer = styled('div', {
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '100px 0 0',
  color: 'white',
});

export const StyledSmallLogo = styled(KLogoComponent, {
  marginBottom: '20px',
});

export const StyledHomeContentContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-evenly',
});

export const StyledHomeContent = styled('div', {
  maxWidth: '600px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(71, 79, 82, 0.5)',
  borderRadius: '4px',
  padding: '24px',
});

export const StyledHomeTitle = styled('h2', {
  fontWeight: 'bolder',
  fontSize: '2.5rem',
  margin: '0 0 1.5rem 0',
});

export const StyledHomeLink = styled(Link, {
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  margin: '12px 0',
  background: 'rgba(5, 5, 5, 0.5)',
  borderRadius: '4px',
  flex: 'none',
  alignSelf: 'stretch',
  flexGrow: '0',
  fontSize: '1.2rem',
  cursor: 'pointer',
  color: 'inherit',
  '&:last-child': {
    marginBottom: '0',
  },
});

export const StyledHomeButton = styled('div', {
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  margin: '12px 0',
  background: 'rgba(5, 5, 5, 0.5)',
  borderRadius: '4px',
  flex: 'none',
  alignSelf: 'stretch',
  flexGrow: '0',
  fontSize: '1.2rem',
  cursor: 'pointer',
  color: 'inherit',
});

export const StyledIconBox = styled('span', {
  display: 'inline-block',
});

export const StyledLinkText = styled('div', {
  margin: '10px',
});
