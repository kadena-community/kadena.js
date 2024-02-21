import type { FC } from 'react';
import { bulletPositionClass } from './styles.css';

interface IProps {
  position: ISigneePosition;
  idx: number;
}

export const SigneePosition: FC<IProps> = ({ position, idx }) => {
  return (
    <div
      data-position={idx}
      className={bulletPositionClass}
      data-xpercentage={position?.xPercentage}
      data-ypercentage={position?.yPercentage}
    ></div>
  );
};
