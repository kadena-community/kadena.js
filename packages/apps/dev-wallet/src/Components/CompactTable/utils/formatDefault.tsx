import type { FC } from 'react';

interface IProps {
  value: string;
}

export const FormatDefault = (): FC<IProps> => {
  const Component: FC<IProps> = ({ value }) => <>{value}</>;
  return Component;
};
