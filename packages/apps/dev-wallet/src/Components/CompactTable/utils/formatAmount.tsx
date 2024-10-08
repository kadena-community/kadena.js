import type { FC } from 'react';

interface IProps {
  value: string;
}

export const FormatAmount = (): FC<IProps> => {
  const Component: FC<IProps> = ({ value }) => <>{value} KDA</>;
  return Component;
};
