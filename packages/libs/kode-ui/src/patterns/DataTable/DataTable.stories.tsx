import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MediaContextProvider } from './../../components';
import type { IDataTableProps } from './DataTable';
import { DataTable } from './DataTable';

const meta: Meta<IDataTableProps> = {
  title: 'Patterns/DataTable',
  parameters: {
    status: { type: 'stable' },
    docs: {
      description: {
        component:
          'The DataTable is a specific way to show table data. On mobile the view switches to a different view, to show the data better',
      },
    },
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<IDataTableProps>;

export const Primary: Story = {
  name: 'DataTable Pattern',
  args: {},
  render: ({}) => {
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
    ];
    return (
      <MediaContextProvider>
        <DataTable
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
