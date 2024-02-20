import classNames from 'classnames';
import type { FC } from 'react';
import { connectThumbClass } from './style.css';

interface IProps {
  token: IProofOfUsTokenMeta;
}
export const ConnectThumb: FC<IProps> = ({ token }) => {
  return (
    <div
      className={classNames(connectThumbClass)}
      style={{
        backgroundColor: token.properties.avatar?.backgroundColor,
        backgroundImage: `url("${token.image}")`,
      }}
    />
  );
};
