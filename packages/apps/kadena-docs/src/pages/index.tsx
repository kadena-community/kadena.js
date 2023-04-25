import { Stack } from '@kadena/react-components';

import { HomeHeader } from '@/components/Layout/Landing/components';
import { DocsPageFC } from '@/types/Layout';
import React from 'react';

const Home: DocsPageFC = () => {
  return (
    <>
      <Stack>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Stack>
    </>
  );
};

Home.meta = {
  title: 'Pact',
  menu: 'Pact',
  label: 'Pact Test',
  order: 1,
  description: 'Home page',
  layout: 'home',
};

export default Home;
