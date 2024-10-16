import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { onLayer2 } from '../../storyDecorators';
import { Link, MediaContextProvider } from './../../components';
import type { ICompactTableProps } from './CompactTable';
import { CompactTable } from './CompactTable';
import { CompactTableFormatters } from './Formatters';

const meta: Meta<ICompactTableProps> = {
  title: 'Patterns/CompactTable',
  decorators: [onLayer2],
  parameters: {
    status: { type: 'stable' },
    docs: {
      description: {
        component:
          'The CompactTable is a specific way to show table data. On mobile the view switches to a different view, to show the data better',
      },
    },
  },
  argTypes: {
    isLoading: {
      type: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<ICompactTableProps>;

export const Primary: Story = {
  name: 'CompactTable Pattern',
  args: {
    isLoading: false,
  },
  render: ({ isLoading }) => {
    const data = [
      {
        node: {
          requestKey: 'key1',
          parameters: 'param1',
          block: {
            height: 10,
          },
        },
      },
      {
        node: {
          requestKey: 'key2',
          parameters: 'param2',
          block: {
            height: 11,
          },
        },
      },
      {
        node: {
          requestKey: 'key3',
          parameters: 'param3',
          block: {
            height: 12,
          },
        },
      },
    ];
    return (
      <MediaContextProvider>
        <CompactTable
          isLoading={isLoading}
          fields={[
            {
              label: 'Height',
              key: 'node.block.height',
              width: '15%',
            },
            {
              label: 'RequestKey',
              key: 'node.requestKey',
              width: '40%',
            },
            {
              label: 'Parameters',
              key: 'node.parameters',
              width: '45%',
            },
          ]}
          data={data}
        />
      </MediaContextProvider>
    );
  },
};

export const FormatLink: Story = {
  name: 'FormatLink',
  args: {
    isLoading: false,
  },
  render: ({ isLoading }) => {
    const data = [
      {
        node: {
          requestKey: 'he-man',
          parameters: 'param1',
          block: {
            height: 10,
          },
        },
      },
      {
        node: {
          requestKey: 'masters of the universe',
          parameters: 'param2',
          block: {
            height: 11,
          },
        },
      },
      {
        node: {
          requestKey: 'skeletor',
          parameters: 'param3',
          block: {
            height: 12,
          },
        },
      },
    ];
    return (
      <MediaContextProvider>
        <CompactTable
          isLoading={isLoading}
          fields={[
            {
              label: 'Height',
              key: 'node.block.height',
              width: '15%',
            },
            {
              label: 'RequestKey',
              key: 'node.requestKey',
              width: '40%',
              render: CompactTableFormatters.FormatLink({
                url: `https://kadena.io`,
              }),
            },
            {
              label: 'Parameters',
              key: 'node.parameters',
              width: '45%',
            },
          ]}
          data={data}
        />
      </MediaContextProvider>
    );
  },
};
