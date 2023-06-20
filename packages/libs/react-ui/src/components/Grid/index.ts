import GridContainer, { IGridContainerProps } from './GridContainer';
import GridItem, { IGridItemProps } from './GridItem';

import { FC } from 'react';

interface IGrid extends FC<IGridContainerProps> {
  Item: FC<IGridItemProps>;
}
export { IGridContainerProps, IGridItemProps };

export const Grid: IGrid = GridContainer as IGrid;
Grid.Item = GridItem;
