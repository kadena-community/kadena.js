import { Input } from '@components/Form/Input';
import { Stack } from '@components/Layout/Stack';
import { Label } from '@components/Typography/Label/Label';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Label> = {
  title: 'Typography/Label',
  component: Label,
  argTypes: {
    children: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Primary: Story = {
  name: 'Label',
  args: {
    children: 'Label',
  },
  render: ({ children }) => (
    <Stack alignItems="center">
      <Label htmlFor="id">{children}</Label>
      <Input id="id" placeholder="Input" outlined />
    </Stack>
  ),
};
