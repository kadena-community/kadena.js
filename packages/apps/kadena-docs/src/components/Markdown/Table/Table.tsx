import { styled, Table as StyledTable } from '@kadena/react-components';

import React, { FC, FunctionComponentElement } from 'react';

const Wrapper = styled('div', {
  margin: '$5 0',
});

interface IProps {
  children:
    | FunctionComponentElement<typeof StyledTable.Body>
    | FunctionComponentElement<typeof StyledTable.Body>[]
    | FunctionComponentElement<typeof StyledTable.Head>
    | FunctionComponentElement<typeof StyledTable.Head>[];
}

export const Table: FC<IProps> = ({ children }) => {
  return (
    <Wrapper>
      <StyledTable>{children}</StyledTable>
    </Wrapper>
  );
};
