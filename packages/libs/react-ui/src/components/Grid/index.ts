import GridItem, { IGridItemProps } from './GridItem';
import GridContainer, { IGridContainerProps } from './GridRoot';

import { FC } from 'react';

export { IGridContainerProps, IGridItemProps };

interface IGrid {
  Root: FC<IGridContainerProps>;
  Item: FC<IGridItemProps>;
}

export const Grid: IGrid = {
  Root: GridContainer,
  Item: GridItem,
};
