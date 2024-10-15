import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { onLayer2 } from '../../storyDecorators';
import { MediaContextProvider } from './../../components';
import type { IDataTableProps } from './DataTable';
import { DataTable } from './DataTable';

const meta: Meta<IDataTableProps> = {
  title: 'Patterns/DataTable',
  decorators: [onLayer2],
  parameters: {
    status: { type: 'stable' },
    docs: {
      description: {
        component:
          'The DataTable is a specific way to show table data. On mobile the view switches to a different view, to show the data better',
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
type Story = StoryObj<IDataTableProps>;

export const Primary: Story = {
  name: 'DataTable Pattern',
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
        <DataTable
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
