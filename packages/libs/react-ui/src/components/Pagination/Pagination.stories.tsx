import { SystemIcon } from '@components/Icon';
import { IPaginationProps, Pagination } from '@components/Pagination';
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
    total: {
      control: {
        type: 'number',
        min: 0,
        max: 20,
        step: 2,
      },
    },
    pageLimit: {
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

export const Default: Story = {
  args: {
    label: 'Label',
    total: 10,
    pageLimit: 3,
  },
  render: ({ total, label, pageLimit }) => {
    const [page, setPage] = React.useState(1);

    return (
      <Pagination
        total={total}
        page={page}
        label={label}
        pageLimit={pageLimit}
        onPageChange={setPage}
      />
    );
  },
};
