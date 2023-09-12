import type { ITableProps } from '@components/Table';
import { Table } from '@components/Table';
import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@theme/vars.css';
import React from 'react';

const selectOptions: (keyof typeof vars.sizes | undefined)[] = [
  undefined,
  ...(Object.keys(vars.sizes) as (keyof typeof vars.sizes)[]),
];

type StoryProps = {
  rowCount: number;
  columnCount: number;
  striped: boolean;
  columnWidth: keyof typeof vars.sizes | undefined;
} & ITableProps;

const meta: Meta<StoryProps> = {
  title: 'Components/Table',
  parameters: {
    docs: {
      description: {
        component:
          'The Table component renders a table element with a head and body. The table can have a visual distinction between rows with the `striped` prop. The column width can be set with the `columnWidth` prop.',
      },
    },
  },
  argTypes: {
    rowCount: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
    },
    columnCount: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
    },
    striped: {
      control: { type: 'boolean' },
    },
    columnWidth: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Set value for padding property with pre-defined size values.',
    },
  },
};

export default meta;
type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Table',
  args: {
    rowCount: 3,
    columnCount: 5,
    striped: false,
  },
  render: ({ rowCount, columnCount, striped }) => {
    return (
      <Table.Root striped={striped}>
        <Table.Head>
          <Table.Tr>
            {Array.from(Array(columnCount)).map((id, tdIdx) => {
              return <Table.Th key={`td${tdIdx}`}>test {tdIdx}</Table.Th>;
            })}
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {Array.from(Array(rowCount)).map((id, idx) => {
            return (
              <Table.Tr key={`tr${idx}`}>
                {Array.from(Array(columnCount)).map((id, tdIdx) => {
                  return <Table.Td key={`td${tdIdx}`}>test {tdIdx}</Table.Td>;
                })}
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table.Root>
    );
  },
};

export const LinkTable: Story = {
  name: 'Table with Link',
  args: {
    rowCount: 3,
    columnCount: 5,
    striped: false,
  },
  render: ({ rowCount, columnCount, striped }) => {
    return (
      <Table.Root striped={striped}>
        <Table.Head>
          <Table.Tr>
            {Array.from(Array(columnCount + 1)).map((id, tdIdx) => {
              return tdIdx === columnCount ? (
                <Table.Th key={`td${tdIdx}`} />
              ) : (
                <Table.Th key={`td${tdIdx}`}>test {tdIdx}</Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {Array.from(Array(rowCount)).map((id, idx) => {
            return (
              <Table.Tr key={`tr${idx}`} url={`#${idx}`}>
                {Array.from(Array(columnCount)).map((id, tdIdx) => {
                  return <Table.Td key={`td${tdIdx}`}>test {tdIdx}</Table.Td>;
                })}
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table.Root>
    );
  },
};

export const StripedTable: Story = {
  args: {
    rowCount: 3,
    columnCount: 5,
    striped: true,
  },
  render: ({ rowCount, columnCount, striped }) => {
    return (
      <Table.Root striped={striped}>
        <Table.Head>
          <Table.Tr>
            {Array.from(Array(columnCount)).map((id, tdIdx) => {
              return <Table.Th key={`td${tdIdx}`}>test {tdIdx}</Table.Th>;
            })}
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {Array.from(Array(rowCount)).map((id, idx) => {
            return (
              <Table.Tr key={`tr${idx}`}>
                {Array.from(Array(columnCount)).map((id, tdIdx) => {
                  return <Table.Td key={`td${tdIdx}`}>test {tdIdx}</Table.Td>;
                })}
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table.Root>
    );
  },
};

export const EmptyRowsTable: Story = {
  name: 'Table with Empty Rows',
  args: {
    rowCount: 5,
    columnCount: 3,
    striped: false,
  },
  render: ({ striped }) => {
    return (
      <Table.Root striped={striped}>
        <Table.Head>
          <Table.Tr>
            <Table.Th>Date Time</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Sender</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          <Table.Tr>
            <Table.Td>March 28, 2023 - 06:23</Table.Td>
            <Table.Td>10</Table.Td>
            <Table.Td>1234</Table.Td>
          </Table.Tr>
          <Table.Tr></Table.Tr>
          <Table.Tr></Table.Tr>
          <Table.Tr>
            <Table.Td>March 28, 2023 - 06:23</Table.Td>
            <Table.Td>10</Table.Td>
            <Table.Td>1234</Table.Td>
          </Table.Tr>
          <Table.Tr></Table.Tr>
        </Table.Body>
      </Table.Root>
    );
  },
};

export const FixedColumnWidth: Story = {
  name: 'Table with Fixed Column Width',
  args: {
    columnWidth: '$32',
  },
  render: ({ columnWidth }) => {
    return (
      <Table.Root wordBreak="break-word">
        <Table.Head>
          <Table.Tr>
            <Table.Th width={columnWidth}>Fixed Width</Table.Th>
            <Table.Th>Other Content</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          <Table.Tr>
            <Table.Td>Fixed with content</Table.Td>
            <Table.Td>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industrys standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Table.Td>
          </Table.Tr>
        </Table.Body>
      </Table.Root>
    );
  },
};
