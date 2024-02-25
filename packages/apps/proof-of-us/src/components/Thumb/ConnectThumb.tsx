import classNames from 'classnames';
import type { FC } from 'react';
import { connectThumbClass } from './style.css';

interface IProps {
  token: IProofOfUsTokenMeta;
  isMinted?: boolean;
}
export const ConnectThumb: FC<IProps> = ({ token, isMinted = true }) => {
  console.log({ isMinted });
  return (
    <div
      className={classNames(connectThumbClass)}
      style={{
        backgroundColor: token.properties.avatar?.backgroundColor,
        backgroundImage: isMinted ? `url("${token.image}")` : '',
      }}
    />
  );
};
