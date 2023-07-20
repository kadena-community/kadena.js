import GridItem, { IGridItemProps } from './GridItem';
import GridRoot, { IGridRootProps } from './GridRoot';

import { FC } from 'react';

export { IGridRootProps as IGridContainerProps, IGridItemProps };

interface IGrid {
  Root: FC<IGridRootProps>;
  Item: FC<IGridItemProps>;
}

export const Grid: IGrid = {
  Root: GridRoot,
  Item: GridItem,
};
