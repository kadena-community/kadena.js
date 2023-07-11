import { styled } from '@kadena/react-components';
import { ITableProps, Table as StyledTable } from '@kadena/react-ui';

import React, { FC } from 'react';

const Wrapper = styled('div', {
  margin: '$5 0',
});

export const Table: FC<ITableProps> = ({ children }) => {
  return (
    <Wrapper>
      <StyledTable.Root>{children}</StyledTable.Root>
    </Wrapper>
  );
};
