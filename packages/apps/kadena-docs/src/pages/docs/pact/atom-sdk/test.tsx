import React, { FC } from 'react';

const Text: FC = () => {
  const test = 'dfg';
  return <div>sdfsf {test}</div>;
};

export const meta: unknown = {
  title: 'Test',
  menu: 'Pact',
  label: 'Test',
  order: 1,
  description: 'How to get started with Markdoc',
  layout: 'full',
};

export default Text;
