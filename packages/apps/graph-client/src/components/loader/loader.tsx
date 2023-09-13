import { SystemIcon } from '@kadena/react-ui';

import { spin } from './styles.css';

import React from 'react';

const Loader: React.FC = () => {
  return <SystemIcon.Loading className={spin} size="lg" />;
};

export default Loader;
