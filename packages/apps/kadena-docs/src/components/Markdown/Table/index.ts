import { styled, StyledComponent } from '@kadena/react-components';

export const Table: StyledComponent<'table'> = styled('table', {
  border: '1px solid $borderColor',
  borderSpacing: 0,
  fontFamily: '$main',
  width: '100%',
  marginBottom: '$5',

  '& th': {
    border: 0,
    padding: '$2',
    textAlign: 'left',
    wordBreak: 'break-word',
    verticalAlign: 'top',
  },

  '& td': {
    border: 0,
    padding: '$2',
    wordBreak: 'break-word',
    verticalAlign: 'top',
  },

  '& tr': {
    border: 0,
    '&:nth-child(even)': {
      backgroundColor: '$neutral2',
    },
  },
});
