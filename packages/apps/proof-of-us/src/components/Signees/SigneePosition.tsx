import { getColorStyle } from '@/utils/getColor';
import classNames from 'classnames';
import type { FC } from 'react';
import { bulletPositionClass, smallClass } from './styles.css';

interface IProps {
  position?: ISigneePosition;
  idx: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLImageElement>;
  variant?: 'default' | 'small';
  accountName?: string;
}

export const SigneePosition: FC<IProps> = ({
  position,
  idx,
  onClick,
  variant = 'default',
  accountName,
}) => {
  const handleClick: React.MouseEventHandler<
    HTMLButtonElement | HTMLImageElement
  > = (e) => {
    if (onClick) onClick(e);
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
      data-account={accountName}
      data-xpercentage={position?.xPercentage}
      data-ypercentage={position?.yPercentage}
      style={getColorStyle(idx)}
    ></button>
  );
};
