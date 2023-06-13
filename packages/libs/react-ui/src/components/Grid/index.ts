import GridContainer, { IGridContainerProps } from './GridContainer';
import GridItem, { IGridItemProps } from './GridItem';

import { FC } from 'react';

interface IGrid {
  Container: FC<IGridContainerProps>;
  Item: FC<IGridItemProps>;
}
export { IGridContainerProps, IGridItemProps };
export const Grid: IGrid = {
  Container: GridContainer,
  Item: GridItem,
};
