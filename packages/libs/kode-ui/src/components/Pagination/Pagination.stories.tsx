import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Stack } from '../Layout/Stack';
import type { IPaginationProps } from '../Pagination';
import { Pagination } from '../Pagination';

const meta: Meta<IPaginationProps> = {
  title: 'Components/Pagination',
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    docs: {
      description: {
        component:
          'This is a navigation component that is used to visually represent and provide interaction elements for pagination. I provides previous and next buttons as well as a subset of the available pages closest to the selected page.<br><br><i>This component has a controlled and uncontrolled state. When a selectedPage is not provided, the component will track state internally.</i>',
      },
    },
  },
  argTypes: {
    selectedPage: {
      control: {
        type: 'number',
        min: 1,
        max: 20,
        step: 1,
      },
      description: 'Current page number. Used when component is controlled.',
      table: {
        type: { summary: 'number' },
      },
    },
    totalPages: {
      control: {
        type: 'number',
        min: 0,
        max: 20,
        step: 2,
      },
      description: 'Total number of pages.',
      table: {
        type: { summary: 'number' },
      },
    },
    visiblePageLimit: {
      control: {
        type: 'number',
        min: 3,
        max: 7,
        step: 1,
      },
      description:
        'Number of pages that are visible and can be directly selected.',
      table: {
        type: { summary: 'number' },
      },
    },
    defaultSelectedPage: {
      control: {
        type: 'number',
        min: 1,
        max: 20,
        step: 1,
      },
      description: 'The default selected page before any interaction.',
      table: {
        type: { summary: 'number' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<IPaginationProps>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Controlled: Story = {
  args: {
    totalPages: 10,
    visiblePageLimit: 3,
    defaultSelectedPage: 2,
    selectedPage: 2,
  },
  render: ({
    totalPages,
    visiblePageLimit,
    defaultSelectedPage,
    selectedPage,
  }) => {
    return (
      <Stack flexDirection="column" gap="sm">
        <Pagination
          totalPages={totalPages}
          selectedPage={selectedPage}
          visiblePageLimit={visiblePageLimit}
          defaultSelectedPage={defaultSelectedPage}
          onPageChange={() => console.log('Updating Page')}
        />
      </Stack>
    );
  },
};

export const Uncontrolled: Story = {
  args: {
    totalPages: 10,
    visiblePageLimit: 3,
    defaultSelectedPage: 2,
  },
  render: ({ totalPages, visiblePageLimit, defaultSelectedPage }) => {
    return (
      <Pagination
        totalPages={totalPages}
        visiblePageLimit={visiblePageLimit}
        defaultSelectedPage={defaultSelectedPage}
        onPageChange={() => console.log('Updating Page')}
      />
    );
  },
};
