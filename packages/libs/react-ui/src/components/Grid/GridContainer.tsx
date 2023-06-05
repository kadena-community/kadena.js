import { gapVariants, GridContainerClass } from './Grid.css';

import classNames from 'classnames';
import React, { CSSProperties, FC, ReactNode } from 'react';

export interface IGridContainerProps {
  children?: ReactNode;
  spacing?: keyof typeof gapVariants;
  templateRows?: CSSProperties['gridTemplateRows'];
  templateColumns?: CSSProperties['gridTemplateColumns'];
  templateAreas?: CSSProperties['gridTemplateAreas'];
}

const GridContainer: FC<IGridContainerProps> = ({
  children,
  spacing = 'md',
  templateAreas,
  templateRows,
  templateColumns,
}) => {
  const styles = {
    gridTemplateAreas: templateAreas,
    gridTemplateRows: templateRows,
    gridTemplateColumns: templateColumns,
  };

  const classList = classNames(GridContainerClass, gapVariants[spacing]);

  return (
    <div className={classList} style={styles}>
      {children}
    </div>
  );
};

export default GridContainer;
