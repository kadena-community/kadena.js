import { ITableProps, Table } from '@components/Table';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  {
    rowCount: number;
    columnCount: number;
    striped: boolean;
  } & ITableProps
> = {
  title: 'Components/Table',
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
  },
};

export default meta;
type Story = StoryObj<
  {
    rowCount: number;
    columnCount: number;
    striped: boolean;
  } & ITableProps
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

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
  name: 'Striped Table',
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
