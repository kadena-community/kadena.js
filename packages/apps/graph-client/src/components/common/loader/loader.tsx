import { MonoLoading } from '@kadena/react-icons';
import React from 'react';
import { spin } from './styles.css';

const Loader: React.FC = () => {
  // add bigger size wrapper
  return <MonoLoading className={spin} />;
};

export default Loader;
