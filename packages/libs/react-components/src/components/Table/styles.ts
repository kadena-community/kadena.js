import { darkTheme, styled } from '../../styles';

import { type StyledComponent } from '@stitches/react/types/styled-component';

export const StyledTr: StyledComponent<'tr'> = styled('tr', {
  '&:nth-child(even)': {
    background: '$neutral2',
  },
});
export const Td: StyledComponent<'td'> = styled('td', {
  padding: '$3 $4',
});
export const Th: StyledComponent<'th'> = styled('th', {
  padding: '$3 $4',
  background: '$neutral4',
  color: '$neutral2',
  textAlign: 'left',

  [`.${darkTheme} &`]: {
    background: '$neutral5',
  },
});

export const StyledTable: StyledComponent<'table'> = styled('table', {
  width: '100%',
  borderSpacing: 0,
  border: '1px solid $neutral3',
  borderRadius: '$sm',

  [`.${darkTheme} &`]: {
    borderColor: '$neutral5',
  },
});
