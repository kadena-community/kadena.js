import type { IContentHeaderProps } from '@components/ContentHeader';
import { ContentHeader } from '@components/ContentHeader';
import { SystemIcon } from '@components/Icon';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    selectIcon: keyof typeof SystemIcon;
  } & IContentHeaderProps
> = {
  title: 'Components/ContentHeader',
  argTypes: {
    selectIcon: {
      options: Object.keys(SystemIcon) as (keyof typeof SystemIcon)[],
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
type Story = StoryObj<
  {
    selectIcon: keyof typeof SystemIcon;
  } & IContentHeaderProps
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'ContentHeader',
  args: {
    selectIcon: 'Account',
    heading: 'Incoming Transactions',
    description:
      'This table is listing all the incoming transaction sorted by date descending descriptive text.',
  },
  render: ({ selectIcon, heading, description }) => {
    const Icon = SystemIcon[selectIcon];
    return (
      <ContentHeader heading={heading} icon={Icon} description={description} />
    );
  },
};
