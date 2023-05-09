import { IDocsPageFC } from '@/types/Layout';
import React from 'react';

const Text: IDocsPageFC = () => {
  return <div>This will be a landing page</div>;
};

Text.meta = {
  title: 'Kadena',
  menu: 'Kadena',
  label: 'Overview',
  order: 0,
  description: 'How to get started',
  layout: 'landing',
};

export default Text;
