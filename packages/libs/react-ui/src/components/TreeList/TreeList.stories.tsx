import { ITreeListProps, TreeList } from './';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<{} & ITreeListProps> = {
  title: 'Components/TreeList',
  argTypes: {
    isOpen: {
      description: 'Initial value for list',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    title: {
      description: 'root title of the tree',
      defaultValue: '',
      control: {
        type: 'text',
      },
    },
    items: {
      description: 'JSON object of items',
      defaultValue: {},
      control: {
        type: 'array',
      },
    },
  },
};

export default meta;
type Story = StoryObj<{} & ITreeListProps>;

export const Dynamic: Story = {
  name: 'TreeList',
  args: {
    title: 'Parent',
    isOpen: true,
    items: [
      {
        title: 'Child 1',
        items: [{ title: 'Sub Child 1' }, { title: 'Sub Child 2' }],
        isOpen: true,
      },
      {
        title: 'Child 2',
        items: [{ title: 'Sub Child 1' }, { title: 'Sub Child 2' }],
        isOpen: true,
      },
    ],
  },
  render: ({ title, isOpen, items }) => {
    return (
      <TreeList title={title} isOpen={Boolean(isOpen)} items={items ?? []} />
    );
  },
};
