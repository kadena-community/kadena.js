import { MonoCAccount } from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { withContentWidth } from '../../storyDecorators';
import type { IContentHeaderProps } from '../ContentHeader';
import { ContentHeader } from '../ContentHeader';

const meta: Meta<IContentHeaderProps> = {
  title: 'Patterns/ContentHeader',
  decorators: [withContentWidth],
  parameters: {
    status: { type: 'experimental' },
  },
  argTypes: {
    icon: {
      control: {
        type: 'select',
      },
    },
    heading: {
      control: {
        type: 'text',
      },
    },
    description: {
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<IContentHeaderProps>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'ContentHeader',
  args: {
    icon: <MonoCAccount />,
    heading: 'Incoming Transactions',
    description:
      'This table is listing all the incoming transaction sorted by date descending descriptive text.',
  },
  render: ({ icon, heading, description }) => {
    return (
      <ContentHeader heading={heading} icon={icon} description={description} />
    );
  },
};
