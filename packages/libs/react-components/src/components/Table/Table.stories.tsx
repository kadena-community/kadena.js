import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { ITable } from '.';
import { Table } from '.';

const meta: Meta<
  {
    rowCount: number;
    columnCount: number;
  } & ITable
> = {
  title: 'Table',
  argTypes: {
    rowCount: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
    },
    columnCount: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    rowCount: number;
    columnCount: number;
  } & ITable
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
  },
  render: ({ rowCount, columnCount }) => {
    return (
      <Table>
        <Table.Head>
          <Table.Tr>
            {Array.from(Array(columnCount)).map((id, tdIdx) => {
              return <Table.Tr.Th key={`td${tdIdx}`}>test {tdIdx}</Table.Tr.Th>;
            })}
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {Array.from(Array(rowCount)).map((id, idx) => {
            return (
              <Table.Tr key={`tr${idx}`}>
                {Array.from(Array(columnCount)).map((id, tdIdx) => {
                  return (
                    <Table.Tr.Td key={`td${tdIdx}`}>test {tdIdx}</Table.Tr.Td>
                  );
                })}
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table>
    );
  },
};
