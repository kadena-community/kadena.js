import { GridItemClass } from './Grid.css';

import React, { CSSProperties, FC, ReactNode } from 'react';

export type ColSpanType = number | 'auto';

export interface IGridItemProps {
  children?: ReactNode;
  colStart?: ColSpanType;
  colEnd?: ColSpanType;
  rowStart?: ColSpanType;
  rowEnd?: ColSpanType;
  area?: CSSProperties['gridArea'];
}

const GridItem: FC<IGridItemProps> = ({
  children,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  area,
}) => {
  const styles =
    area === undefined
      ? {
          gridColumnStart: colStart,
          gridColumnEnd: colEnd,
          gridRowStart: rowStart,
          gridRowEnd: rowEnd,
        }
      : {
          gridArea: area,
        };

  return (
    <div className={GridItemClass} style={styles}>
      {children}
    </div>
  );
};

export default GridItem;
