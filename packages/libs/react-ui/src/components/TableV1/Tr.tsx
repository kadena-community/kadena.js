import { MonoChevronLeft, MonoChevronRight } from '@kadena/react-icons/system';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { Link } from '..';
import type { PressEvent } from '../Button';
import { Button } from '../Button/Button';
import { linkButtonClass, trClass } from './Table.css';
import { Td } from './Td';
import { Th } from './Th';
import type { CompoundType } from './types';

export interface ITrProps {
  children?: CompoundType<typeof Td> | CompoundType<typeof Th>;
  url?: string;
  onClick?: (e: PressEvent) => void;
  className?: string;
}

export const Tr: FC<ITrProps> = ({ children, url, onClick, className }) => {
  return (
    <tr className={classNames(trClass, className)}>
      {React.Children.map(children, (child) => {
        if (
          !React.isValidElement(child) ||
          (Boolean(child) && child.type !== Th && child.type !== Td)
        )
          return null;

        return child;
      })}

      {url !== undefined ? (
        <td className={linkButtonClass}>
          <Link href={url} title={url} aria-label={url}>
            <MonoChevronRight />
          </Link>
        </td>
      ) : onClick !== undefined ? (
        <td className={linkButtonClass}>
          <Button title="" aria-label="" onClick={onClick}>
            <MonoChevronLeft />
          </Button>
        </td>
      ) : (
        ''
      )}
    </tr>
  );
};
