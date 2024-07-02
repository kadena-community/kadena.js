import { MonoLoading } from '@kadena/kode-icons';
import React from 'react';
import { spin } from './styles.css';

const Loader: React.FC = () => {
  return <MonoLoading className={spin} />;
};

export default Loader;
