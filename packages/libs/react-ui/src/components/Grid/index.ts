import { type IGridItemProps, GridItem } from './GridItem';
import { type IGridRootProps, GridRoot } from './GridRoot';

import { type FC } from 'react';

export type { IGridRootProps as IGridContainerProps, IGridItemProps };

interface IGrid {
  Root: FC<IGridRootProps>;
  Item: FC<IGridItemProps>;
}

export const Grid: IGrid = {
  Root: GridRoot,
  Item: GridItem,
};
