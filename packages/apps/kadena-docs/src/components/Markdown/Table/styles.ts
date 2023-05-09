import { styled, StyledComponent } from '@kadena/react-components';

export const Table: StyledComponent<'table'> = styled('table', {
  border: '1px solid $borderColor',
  borderSpacing: 0,
  fontFamily: '$main',
  width: '100%',
  marginBottom: '$5',
});

export const Td: StyledComponent<'td'> = styled('td', {
  border: 0,
  padding: '$2',
  wordBreak: 'break-word',
  verticalAlign: 'top',
});

export const Thead: StyledComponent<'thead'> = styled('thead', {
  '& th': {
    border: 0,
    padding: '$2',
    textAlign: 'left',
    wordBreak: 'break-word',
    verticalAlign: 'top',
  },
});

export const Tr: StyledComponent<'tr'> = styled('tr', {
  border: 0,
  '&:nth-child(even)': {
    backgroundColor: 'green',
  },
});
