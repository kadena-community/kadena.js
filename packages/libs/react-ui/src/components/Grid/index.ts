import GridContainer, { IGridContainerProps } from './GridContainer';
import GridItem, { IGridItemProps } from './GridItem';

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
