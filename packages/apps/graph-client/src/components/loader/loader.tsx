import { FC } from 'react';
import { spin } from './styles.css';
import { SystemIcon } from '@kadena/react-ui';

const Loader: FC = () => {
  return <SystemIcon.Loading className={spin} size="lg" />;
};

export default Loader;
