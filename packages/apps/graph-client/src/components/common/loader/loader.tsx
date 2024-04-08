import { MonoLoading } from '@kadena/react-icons';
import React from 'react';
import { spin } from './styles.css';

const Loader: React.FC = () => {
  return <MonoLoading className={spin} size="lg" />;
};

export default Loader;
