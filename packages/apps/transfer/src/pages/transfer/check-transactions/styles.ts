import { styled } from '@kadena/react-components';

export const StyledMainContent = styled('main', {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '$16',
});

export const StyledSidebar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '25%',
  height: '100%',
});

export const StyledForm = styled('form', {
  width: '75%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '$8',
  padding: '$8',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
  '> *': {
    mb: '$8 ',
  },
});

export const StyledSmallField = styled('div', {
  maxWidth: '150px',
  width: '100%',
});

export const StyledMediumField = styled('div', {
  width: '100%',
});

export const StyledFormButton = styled('div', {
  minWidth: '180px',
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
