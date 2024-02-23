import { Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
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
}

export const SigneeItem: FC<IProps> = ({
  name,
  accountName,
  idx,
  socialLink,
}) => {
  return (
    <Stack
      className={itemClass}
      flexDirection="column"
      alignItems="center"
      gap="sm"
    >
      <Stack width="100%">
        <div className={bulletClass} data-position={idx} />
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
    </Stack>
  );
};
