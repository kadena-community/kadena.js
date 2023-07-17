import { ITagProps, Tag } from '@components/Tag';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    text: string;
  } & ITagProps
> = {
  title: 'Components/Tag',
  component: Tag,
  argTypes: {
    text: {
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    text: string;
  } & ITagProps
>;

export const Primary: Story = {
  name: 'Tag',
  args: {
    text: 'Tag',
  },
  render: ({ text }) => {
    return <Tag>{text}</Tag>;
  },
};
