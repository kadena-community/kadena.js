import { linkButtonClass, trClass } from './Table.css';
import { Td } from './Td';
import { Th } from './Th';
import type { CompoundType } from './types';

import { IconButton } from '@components/IconButton';
import type { FC, ReactNode } from 'react';
import React from 'react';

export interface ITrProps {
  children?: CompoundType<typeof Td> | CompoundType<typeof Th>;
  url?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Tr: FC<ITrProps> = ({ children, url, onClick }) => {
  return (
    <tr className={trClass}>
      {React.Children.map(children, (child: ReactNode) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== Th && child.type !== Td)
        )
          return null;

        return child;
      })}

      {url !== undefined ? (
        <td className={linkButtonClass}>
          <IconButton as="a" href={url} title={url} icon="TrailingIcon" />
        </td>
      ) : onClick !== undefined ? (
        <td className={linkButtonClass}>
          <IconButton
            as="button"
            title=""
            onClick={onClick}
            icon="TrailingIcon"
          />
        </td>
      ) : (
        ''
      )}
    </tr>
  );
};
