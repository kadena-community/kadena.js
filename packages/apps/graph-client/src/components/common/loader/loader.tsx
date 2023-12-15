import { SystemIcon } from '@kadena/react-ui';
import React from 'react';
import { spin } from './styles.css';

const Loader: React.FC = () => {
  return <SystemIcon.Loading className={spin} size="lg" />;
};

export default Loader;
