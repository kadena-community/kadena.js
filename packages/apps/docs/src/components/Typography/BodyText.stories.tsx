import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { IBodyTextProps } from './BodyText';
import { BodyText } from './BodyText';

const selectOptions: string[] = ['p', 'span'];

const meta: Meta<IBodyTextProps> = {
  title: 'Typography/BodyText',
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
type Story = StoryObj<IBodyTextProps>;

export const Default: Story = {
  name: 'Default',
  args: {
    as: 'p',
    bold: false,
  },
  render: ({ as, bold }) => (
    <div>
      <BodyText as={as} bold={bold}>
        Hello! I&apos;m there...!
      </BodyText>
    </div>
  ),
};
