import { SystemIcon } from '@components/Icon';
import { IPaginationProps, Pagination } from '@components/Pagination';
import { Stack } from '@components/Stack';
import { Heading } from '@components/Typography';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    helperText: string;
    leadingText: string;
    leftIcon: keyof typeof SystemIcon;
    rightIcon: keyof typeof SystemIcon;
  } & IPaginationProps
> = {
  title: 'Components/Pagination',
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    totalPages: {
      control: {
        type: 'number',
        min: 0,
        max: 20,
        step: 2,
      },
    },
    visiblePageLimit: {
      control: {
        type: 'number',
        min: 3,
        max: 7,
        step: 1,
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
    label: 'Label',
    totalPages: 10,
    visiblePageLimit: 3,
  },
  render: ({ totalPages, label, visiblePageLimit }) => {
    const [page, setPage] = React.useState(1);

    return (
      <Stack direction="column" spacing="$4">
        <Heading as="h6">Controlled Page State: {page}</Heading>
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          label={label}
          visiblePageLimit={visiblePageLimit}
          onPageChange={setPage}
        />
      </Stack>
    );
  },
};

export const Uncontrolled: Story = {
  args: {
    label: 'Label',
    totalPages: 10,
    visiblePageLimit: 3,
  },
  render: ({ totalPages, label, visiblePageLimit }) => {
    return (
      <Pagination
        totalPages={totalPages}
        label={label}
        visiblePageLimit={visiblePageLimit}
        onPageChange={() => console.log('Updating Page')}
      />
    );
  },
};
