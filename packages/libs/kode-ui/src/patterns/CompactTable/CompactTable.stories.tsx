import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { onLayer2 } from '../../storyDecorators';
import { MediaContextProvider } from './../../components';
import type { ICompactTableProps } from './CompactTable';
import { CompactTable } from './CompactTable';
import { CompactTableFormatters } from './TableFormatters';

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

const data = [
  {
    node: {
      status: 'success',
      requestKey: 'he-man',
      parameters: 'param1',
      block: {
        height: 10,
      },
      balance: {
        balance: '1093.33',
      },
    },
  },
  {
    node: {
      status: 'success',
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
      balance: {
        balance: '45.2222',
      },
    },
  },
];

export default meta;
type Story = StoryObj<ICompactTableProps>;

export const Primary: Story = {
  name: 'CompactTable Pattern',
  args: {
    isLoading: false,
  },
  render: ({ isLoading }) => {
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

export const FormatStatus: Story = {
  name: 'FormatStatus',
  args: {
    isLoading: false,
  },
  render: ({ isLoading }) => {
    return (
      <MediaContextProvider>
        <CompactTable
          isLoading={isLoading}
          fields={[
            {
              label: 'Status',
              key: 'node.status',
              width: '15%',
              render: CompactTableFormatters.FormatStatus(),
            },
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
              width: '30%',
            },
          ]}
          data={data}
        />
      </MediaContextProvider>
    );
  },
};

export const FormatMultiStepTx: Story = {
  name: 'FormatMultiStepTx',
  args: {
    isLoading: false,
  },
  render: ({ isLoading }) => {
    return (
      <MediaContextProvider>
        <CompactTable
          isLoading={isLoading}
          fields={[
            {
              label: 'Status',
              key: 'node.status',
              width: '15%',
              render: CompactTableFormatters.FormatMultiStepTx(),
            },
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
              width: '30%',
            },
          ]}
          data={data}
        />
      </MediaContextProvider>
    );
  },
};

export const FormatAmount: Story = {
  name: 'FormatAmount',
  args: {
    isLoading: false,
  },
  render: ({ isLoading }) => {
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
              width: '30%',
              render: CompactTableFormatters.FormatLink({
                url: `https://kadena.io`,
              }),
            },
            {
              label: 'Parameters',
              key: 'node.parameters',
              width: '30%',
            },
            {
              label: 'Balance',
              key: 'node.balance.balance',
              width: '25%',
              render: CompactTableFormatters.FormatAmount(),
              align: 'end',
            },
          ]}
          data={data}
        />
      </MediaContextProvider>
    );
  },
};

export const FormatWithkeyArray: Story = {
  name: 'Format Array Key',
  args: {
    isLoading: false,
  },
  render: ({ isLoading }) => {
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
              width: '30%',
              render: CompactTableFormatters.FormatLink({
                url: `https://kadena.io`,
              }),
            },
            {
              label: 'Parameters',
              key: ['node.parameters', 'node.balance.balance'],
              width: '55%',
            },
          ]}
          data={data}
        />
      </MediaContextProvider>
    );
  },
};
