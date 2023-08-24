import { IProps, SubBodyText } from './SubBodyText';

import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const selectOptions: string[] = ['p', 'span'];

const meta: Meta<IProps> = {
  title: 'Typography/SubBodyText',
  argTypes: {
    as: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    bold: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<IProps>;

export const Default: Story = {
  name: 'Default',
  args: {
    as: 'p',
    bold: false,
  },
  render: ({ as, bold }) => (
    <div>
      <SubBodyText as={as} bold={bold}>
        Hello! I&apos;m sub body text...!
      </SubBodyText>
    </div>
  ),
};
