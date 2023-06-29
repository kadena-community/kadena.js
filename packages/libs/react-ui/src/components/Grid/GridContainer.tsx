import { gapVariants, gridContainerClass } from './Grid.css';

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
  // TODO: Investigate alternative ways to using the style attribute
  // https://github.com/kadena-community/kadena.js/pull/360#discussion_r1221843805
  const classList = classNames(gapVariants[spacing], gridContainerClass);
  return (
    <div className={classList} style={styles} data-testid="kda-grid-container">
      {children}
    </div>
  );
};

export default GridContainer;
