import classNames from 'classnames';
import type { FC } from 'react';
import { connectThumbClass, thumbWrapClass } from './style.css';

interface IProps {
  token: IProofOfUsTokenMeta;
}
export const ConnectThumb: FC<IProps> = ({ token }) => {
  return (
    <span className={thumbWrapClass}>
      <div
        className={classNames(connectThumbClass)}
        style={{
          backgroundColor: token.properties.avatar?.backgroundColor,
          backgroundImage: `url("${token.image}")`,
        }}
      />
    </span>
  );
};
