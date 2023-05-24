import { styled } from '@kadena/react-components';

import { Chain, ChevronLeft } from '@/resources/svg/generated';
import Link from 'next/link';

export const StyledCheckBalanceWrapper = styled('div', {
  padding: '40px',
  color: 'white',
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

export const StyledLogoTextContainer = styled('div', {
  display: 'flex',
  width: '60%',
});

export const StyledHeaderText = styled('div', {
  textAlign: 'left',
  marginLeft: '16px',
});

export const StyledTextNormal = styled('div', {
  margin: '0 0 10px 10px',
  fontSize: '1rem',
});

export const StyledTextBold = styled('div', {
  margin: '0 0 16px 10px',
  fontWeight: 'bold',
  fontSize: '2rem',
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

export const StyledIconImage = styled(Chain, {
  width: '10%',
  marginLeft: '8px',
});

export const StyledTitleContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flexStart',
  alignItems: 'center',
  margin: '2rem 0',
});

export const StyledBack = styled(Link, {
  width: '35%',
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

export const StyledChevronRight = styled('div', {
  marginLeft: '16px',
});

export const StyledTitle = styled('h2', {
  fontSize: '2rem',
  fontWeight: 'normal',
});

export const StyledMainContent = styled('main', {});

export const StyledFormContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
});

export const StyledForm = styled('form', {
  width: '65%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

export const StyledAccountForm = styled('div', {
  width: '100%',
  padding: '16px',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
  '> *': {
    mb: '$8 ',
  },
});

export const StyledField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flexStart',
  margin: '20px 0',
});

export const StyledInputLabel = styled('label', {
  fontSize: '1rem',
  marginBottom: '12px',
  color: 'white',
  fontWeight: '500',
  lineHeight: '17px',
});

export const StyledInputField = styled('input', {
  padding: '16px',
  outline: 'none',
  background: '#050505',
  border: 'none',
  borderBottom: '1px solid #5A5A5A',
  borderRadius: '4px',
  color: '#F0F0F0',
});

export const StyledFormButton = styled('div', {
  marginTop: '16px',
});

export const StyledResultContainer = styled('div', {
  fontSize: '1rem',
});

export const StyledTotalContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',

  margin: '4% auto',
  padding: '8px',
  borderRadius: '4px',
  background: 'rgba(5, 5, 5, 0.5)',
});

export const StyledTotalChunk = styled('div', {
  width: '50%',
});

export const StyledAccountTotalValue = styled('div', {
  fontWeight: 'bold',
  fontSize: '1.5rem',
});

export const StyledTableContainer = styled('div', {
  margin: '4% auto',
  table: {
    width: '100%',
    textAlign: 'center',
    tbody: {
      tr: {
        height: '2.8rem',
        '&:nth-child(odd)': {
          backgroundColor: '#2d2d2d42',
        },
      },
      td: {
        textAlign: 'center',
        padding: '0.3rem 0.5rem',
        '&:nth-child(2)': {
          overflowWrap: 'anywhere',
        },
      },
    },
  },
});

export const StyledTableHead = styled('div', {
  fontWeight: 'bold',
  background: 'rgba(5 5 5 0.5)',
  th: {
    padding: '1em',
  },
});
