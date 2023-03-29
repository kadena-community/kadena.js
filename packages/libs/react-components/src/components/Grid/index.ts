import { IGridContainerProps, IGridItemProps } from '../../typings';

import Container from './GridContainer';
import Item from './GridItem';

import { FC } from 'react';

interface IGrid {
  Container: FC<IGridContainerProps>;
  Item: FC<IGridItemProps>;
}

export { IGridContainerProps, IGridItemProps };
export const Grid: IGrid = { Container, Item };
