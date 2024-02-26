import classNames from 'classnames';
import type { FC } from 'react';
import { bulletPositionClass, smallClass } from './styles.css';

interface IProps {
  position?: ISigneePosition;
  idx: number;
  onClick?: () => void;
  variant?: 'default' | 'small';
}

export const SigneePosition: FC<IProps> = ({
  position,
  idx,
  onClick,
  variant = 'default',
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  if (!position) return null;
  return (
    <button
      onClick={handleClick}
      data-position={idx}
      className={classNames(
        bulletPositionClass,
        variant === 'small' && smallClass,
      )}
      data-xpercentage={position?.xPercentage}
      data-ypercentage={position?.yPercentage}
    ></button>
  );
};
