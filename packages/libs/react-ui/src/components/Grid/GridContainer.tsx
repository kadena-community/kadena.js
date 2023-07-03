import { gapVariants, gridContainerClass } from './Grid.css';

import classNames from 'classnames';
import React, { CSSProperties, FC, ReactNode } from 'react';

export interface IGridContainerProps {
  children?: ReactNode;
  spacing?: keyof typeof gapVariants;

  columns?: number;
}

const GridContainer: FC<IGridContainerProps> = ({
  children,
  spacing = 'md',
  columns,
}) => {
  const gridTemplateColumns = `repeat(${columns}, 1fr)`;
  const styles = {
    gridTemplateColumns,
  };
  const classList = classNames(gapVariants[spacing], gridContainerClass);
  return (
    <div className={classList} style={styles}>
      {children}
    </div>
  );
};

export default GridContainer;
