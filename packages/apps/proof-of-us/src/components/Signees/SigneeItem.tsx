import { Stack } from '@kadena/react-ui';
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
  socialLink?: ISocial;
  idx: number;
  isMultiple: boolean;
}

const TRANSPARENT = '7D';
const colors = [
  '#2898BD',
  '#5E4DB2',
  '#E56910',
  '#943D73',
  '#09326C',
  '#8F7EE7',
  '#50253F',
  '#A54800',
];
const getColors = (idx: number) => {
  return colors[idx % 8] + TRANSPARENT;
};

export const SigneeItem: FC<IProps> = ({
  name,
  accountName,
  idx,
  socialLink,
  isMultiple,
}) => {
  const colorStyle = {
    '--bulletColor': getColors(idx),
  } as any;
  return (
    <li className={classNames(isMultiple ? multipleSigneeClass : itemClass)}>
      <Stack width="100%">
        <div className={bulletClass} data-position={idx} style={colorStyle} />
        <div className={classNames(titleClass, ellipsClass)}>{name}</div>
      </Stack>
      <div className={classNames(nameClass, ellipsClass)}>{accountName}</div>
      {socialLink && (
        <Stack justifyContent="center">
          <a href="{socialLink}" target="_blank">
            Social Link
          </a>
        </Stack>
      )}
    </li>
  );
};
