import { IPageMeta } from '@/types/Layout';
import React, { FC } from 'react';

const Text: FC = () => {
  const test = 'dfg';
  return <div>sdfsf {test}</div>;
};

export const meta: IPageMeta = {
  title: 'Pact',
  menu: 'Pact',
  label: 'Pact Test',
  order: 1,
  description: 'How to get started with Markdoc',
  layout: 'full',
};

export default Text;
