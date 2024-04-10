import type { FC, PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {
  percentage: number;
}

export const SignedPercentage: FC<IProps> = ({ percentage }) => {
  return <span>{percentage * 100}%</span>;
};
