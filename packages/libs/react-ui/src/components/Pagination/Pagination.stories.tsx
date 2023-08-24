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
  parameters: {
    docs: {
      description: {
        component:
          '<i>Note: maximum navigation items is currently limited (not technically enforced).</i><br><br><strong>Label </strong><br> is used to allow screen readers to notify user that there is a pagination here.',
      },
    },
  },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      description: 'Text that is passed to the Nav element as an aria-label for accessibility.',
    },
    totalPages: {
      control: {
        type: 'number',
        min: 0,
        max: 20,
        step: 2,
      },
      description: 'Total number of pages.',
    },
    visiblePageLimit: {
      control: {
        type: 'number',
        min: 3,
        max: 7,
        step: 1,
      },
      description: 'Number of pages that are visible and can be directly selected.',
    },
    initialSelectedPage: {
      control: {
        type: 'number',
        min: 1,
        max: 20,
        step: 1,
      },
      description: 'The default selected page before any interaction.',
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
    label: 'Pagination',
    totalPages: 10,
    visiblePageLimit: 3,
    initialSelectedPage: 2,
  },
  render: ({ totalPages, label, visiblePageLimit, initialSelectedPage }) => {
    const [page, setPage] = React.useState(initialSelectedPage ?? 1);

    return (
      <Stack direction="column" gap="$4">
        <Heading as="h6">Controlled Page State: {page}</Heading>
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          label={label}
          visiblePageLimit={visiblePageLimit}
          initialSelectedPage={initialSelectedPage}
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
    initialSelectedPage: 2,
  },
  render: ({ totalPages, label, visiblePageLimit, initialSelectedPage }) => {
    return (
      <Pagination
        totalPages={totalPages}
        label={label}
        visiblePageLimit={visiblePageLimit}
        initialSelectedPage={initialSelectedPage}
        onPageChange={() => console.log('Updating Page')}
      />
    );
  },
};
