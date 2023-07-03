import { styled } from '@kadena/react-components';

import { Chain, ChevronLeft } from '@/resources/svg/generated';
import Link from 'next/link';

export const StyledLayout = styled('div', {
  background: `url("/images/slide-3x.png") no-repeat center center fixed`,
  minHeight: '100vh',
});

export const StyledBack = styled(Link, {
  width: '25%',
  textAlign: 'left',
  fontSize: '$base',
  cursor: 'pointer',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
});

export const StyledChevronLeft = styled(ChevronLeft, {
  mr: '$4',
});

export const StyledIconImage = styled(Chain, {
  width: '10%',
  ml: '$2',
});

export const StyledMainLayout = styled('div', {
  padding: '$2xl',
  color: 'white',
  '> *': {
    '&:not(last-child)': {
      marginBottom: '$xl',
    },
  },
});

export const StyledTextBold = styled('div', {
  marginBottom: '$md',
  fontWeight: 'bold',
  fontSize: '$3xl',
});

export const StyledTitle = styled('h2', {
  fontSize: '$3xl',
  fontWeight: 'normal',
});

export const StyledMainContent = styled('main');

export const StyledFooter = styled('footer');
