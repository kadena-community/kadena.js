import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import {
  bulletClass,
  itemClass,
  titleClass,
  titleClassWrapper,
} from './styles.css';

interface IProps {
  name: string;
  accountName?: string;
  socialLink?: ISocial;
  idx: number;
}

export const SigneeItem: FC<IProps> = ({
  name,
  accountName,
  idx,
  socialLink,
}) => {
  return (
    <li className={itemClass}>
      <Stack display="flex" style={{ minWidth: '0' }}>
        <div className={bulletClass} data-position={idx} />
        <div className={titleClassWrapper}>
          <div className={titleClass}>{name}</div>
        </div>
      </Stack>
      <Stack>{accountName}</Stack>
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
