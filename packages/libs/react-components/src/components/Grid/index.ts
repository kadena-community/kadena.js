import type { FC } from 'react';
import Container, { IGridContainerProps } from './GridContainer';
import Item, { IGridItemProps } from './GridItem';

interface IGrid {
  Container: FC<IGridContainerProps>;
  Item: FC<IGridItemProps>;
}

export { IGridContainerProps, IGridItemProps };
export const Grid: IGrid = { Container, Item };
