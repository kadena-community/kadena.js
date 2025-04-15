import { MonoLoading } from '@kadena/kode-icons';
import type { FC } from 'react';
import { loaderClass } from './styles.css';

interface IProps {
  width?: number;
  height?: number;
}

export const LoadingIcon: FC<IProps> = ({ width = 24, height = 24 }) => {
  return <MonoLoading className={loaderClass} width={width} height={height} />;
};
