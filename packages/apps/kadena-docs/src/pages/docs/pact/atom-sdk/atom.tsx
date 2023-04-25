import { DocsPageFC } from '@/types/Layout';
import React from 'react';

const Text: DocsPageFC = () => {
  const test = 'dfg';
  return <div>sdfsf {test}</div>;
};

Text.meta = {
  title: 'Pact',
  menu: 'Pact',
  label: 'Pact Test',
  order: 1,
  description: 'How to get started with Markdoc',
  layout: 'code',
};

export default Text;
