import { styled } from '@kadena/react-components';

export const StyledContent = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',
  padding: '$8',
  background: 'rgba(71, 79, 82, 0.4)',
  borderRadius: '4px',
  boxSizing: 'borderBox',
});

export const StyledSmallField = styled('div', {
  maxWidth: '150px',
  width: '100%',
});

export const StyledMediumField = styled('div', {
  width: '100%',
});

export const StyledFormButton = styled('div', {
  minWidth: '190px',
});

export const StyledResultContainer = styled('div', {
  fontSize: '1rem',
});

export const StyledTable = styled('table', {
  border: '1px solid rgba(158, 161, 166, 0.4)',
  borderRadius: '4px',
  width: '100%',
});

export const StyledTableHead = styled('thead', {
  backgroundColor: '#474F52',
});

export const StyledTableBody = styled('tbody', {});

export const StyledTableRow = styled('tr', {
  '&:nth-child(even)': {
    backgroundColor: 'rgba(158, 161, 166, 0.1)',
  },
});

export const StyledTableHeader = styled('th', {
  padding: '6px 12px',
  textAlign: 'left',
  '&:last-child': {
    textAlign: 'right',
  },
});

export const StyledTableData = styled('td', {
  padding: '12px',
  '&:last-child': {
    textAlign: 'right',
  },
  wordBreak: 'break-word',
});
