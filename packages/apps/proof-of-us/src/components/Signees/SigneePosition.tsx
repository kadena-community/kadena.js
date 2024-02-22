import type { FC } from 'react';
import { bulletPositionClass } from './styles.css';

interface IProps {
  position?: ISigneePosition;
  idx: number;
  onClick?: () => void;
}

export const SigneePosition: FC<IProps> = ({ position, idx, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  if (!position) return null;
  return (
    <button
      onClick={handleClick}
      data-position={idx}
      className={bulletPositionClass}
      data-xpercentage={position?.xPercentage}
      data-ypercentage={position?.yPercentage}
    ></button>
  );
};
