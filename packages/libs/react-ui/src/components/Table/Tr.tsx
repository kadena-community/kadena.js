import { SystemIcon } from '../Icons';

import { trClass, urlContainerClass } from './Table.css';
import { Td } from './Td';
import { Th } from './Th';
import { CompoundType } from './types';

import React, { FC } from 'react';

export interface ITrProps {
  children?: CompoundType<typeof Td> | CompoundType<typeof Th>;
  url?: string;
}

export const Tr: FC<ITrProps> = ({ children, url }) => {
  const handleClick = (): void => {
    if (url !== undefined) {
      window.location.href = url;
    }
  };
  return (
    <tr
      className={trClass}
      onClick={url !== undefined ? handleClick : undefined}
    >
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== Th && child.type !== Td)
        )
          return null;

        return child;
      })}

      {url !== undefined && (
        <td>
          <div className={urlContainerClass}>
            <SystemIcon.TrailingIcon size={'md'} />
          </div>
        </td>
      )}
    </tr>
  );
};
