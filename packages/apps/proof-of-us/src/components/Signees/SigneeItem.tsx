import { getColorStyle } from '@/utils/getColor';
import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import { multipleSigneeClass } from '../ListSignees/style.css';
import {
  bulletClass,
  ellipsClass,
  itemClass,
  nameClass,
  titleClass,
} from './styles.css';

interface IProps {
  name?: string;
  accountName?: string;
  idx: number;
  isMultiple: boolean;
}

export const SigneeItem: FC<IProps> = ({
  name,
  accountName,
  idx,
  isMultiple,
}) => {
  return (
    <li className={classNames(isMultiple ? multipleSigneeClass : itemClass)}>
      <Stack width="100%">
        <div
          className={bulletClass}
          data-position={idx}
          style={getColorStyle(idx)}
        />
        <div className={classNames(titleClass, ellipsClass)}>{name}</div>
      </Stack>
      <div className={classNames(nameClass, ellipsClass)}>{accountName}</div>
    </li>
  );
};
