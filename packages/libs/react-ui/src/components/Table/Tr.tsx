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
  return (
    <tr className={trClass}>
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
          <a href={url} className={urlContainerClass}>
            <SystemIcon.TrailingIcon size={'md'} />
          </a>
        </td>
      )}
    </tr>
  );
};
