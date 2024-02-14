import classNames from 'classnames';
import type { FC } from 'react';
import { multiThumbClass, thumbWrapClass } from './style.css';

interface IProps {
  token: IProofOfUsTokenMeta;
}
export const MultiThumb: FC<IProps> = ({ token }) => {
  return (
    <span className={thumbWrapClass}>
      <div
        className={classNames(multiThumbClass)}
        style={{
          backgroundColor: token.properties.avatar?.backgroundColor,
          backgroundImage: `url("${token.image}")`,
        }}
      />
    </span>
  );
};
