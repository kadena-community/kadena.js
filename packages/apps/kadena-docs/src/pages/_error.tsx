import { Stack } from '@kadena/react-components';

import { IDocsPageFC } from '@/types/Layout';
import React from 'react';

const Home: IDocsPageFC = () => {
  return <Stack>Error</Stack>;
};

Home.meta = {
  title: 'Error',
  menu: 'Error',
  label: 'This isnt working',
  order: 1,
  description: 'Home page',
  layout: 'home',
};

export default Home;
