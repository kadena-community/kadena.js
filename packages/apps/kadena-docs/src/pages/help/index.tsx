import { Heading, Stack } from '@kadena/react-components';

import { IDocsPageFC } from '@/types/Layout';
import React from 'react';

const Help: IDocsPageFC = () => {
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
