import { styled } from '@kadena/react-components';

import Link from 'next/link';

export const StyledHomeContent = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(71, 79, 82, 0.5)',
  borderRadius: '$sm',
  padding: '$6',
});

export const StyledHomeTitle = styled('h2', {
  fontWeight: 'bolder',
  fontSize: '$5xl',
  mb: '$md',
});

export const StyledHomeLink = styled(Link, {
  display: 'flex',
  alignItems: 'center',
  padding: '$4',
  my: '$3',
  background: 'rgba(5, 5, 5, 0.5)',
  borderRadius: '$sm',
  flex: 'none',
  alignSelf: 'stretch',
  flexGrow: '0',
  fontSize: '$lg',
  cursor: 'pointer',
  color: 'inherit',
  '&:last-child': {
    marginBottom: '0',
  },
});

export const StyledIconBox = styled('span', {
  display: 'inline-block',
});

export const StyledLinkText = styled('div', {
  margin: '$xs',
});
