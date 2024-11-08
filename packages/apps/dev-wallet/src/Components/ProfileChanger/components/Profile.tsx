import { Stack } from '@kadena/kode-ui';
import { FC, PropsWithChildren } from 'react';
import { profileClass } from './style.css';

interface IProps extends PropsWithChildren {
  idx?: number;
  color: string;
  isActive: boolean;
  onClick: () => void;
  hasMoreOptions: boolean;
}

export const Profile: FC<IProps> = ({
  children,
  color,
  idx,
  isActive,
  onClick,
  hasMoreOptions,
}) => {
  return (
    <Stack
      as="button"
      data-hasMoreOptions={hasMoreOptions}
      onClick={() => onClick()}
      className={profileClass({ isActive })}
      style={{
        backgroundColor: color,
        zIndex: idx ?? 0 + 1,
        transform:
          idx && hasMoreOptions
            ? `translateX(-${90 * idx}%)`
            : `translateX(-100%)`,
      }}
    >
      {children}
    </Stack>
  );
};
