import { Heading } from '@kadena/react-components';

import React, { FC } from 'react';

const Help: FC = () => {
  return <Heading as="h2">This will be the help page</Heading>;
};

Help.meta = {
  title: 'Help',
  menu: 'Help',
  label: 'Pact Test',
  order: 1,
  description: 'Help page',
  layout: 'landing',
};

export default Help;
