import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import type { SortDescriptor } from 'react-stately';
import { onLayer2 } from '../../storyDecorators';
import { Cell, Column, Row, Table, TableBody, TableHeader } from './';

const columns = [
  { name: 'Name', key: 'name', isRowHeader: true },
  { name: 'Type', key: 'type', isRowHeader: false },
  { name: 'Date Modified', key: 'date', isRowHeader: false },
];

const rows = [
  {
    id: 1,
    name: 'Main',
    date: '6/7/2020',
    type: 'Website',
    href: 'https://www.kadena.io',
  },
  {
    id: 2,
    name: 'Docs',
    date: '4/7/2021',
    type: 'Documentation',
    href: 'https://docs.kadena.io',
  },
  {
    id: 3,
    name: 'Tools',
    date: '11/20/2010',
    type: 'Tool',
    href: 'https://tools.kadena.io/',
  },
  {
    id: 4,
    name: 'Marmalade',
    date: '1/18/2016',
    type: 'Product',
    href: 'https://www.marmalade.art',
  },
];

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  decorators: [onLayer2],
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    docs: {
      description: {
        component:
          "The Table component is a wrapper around [react-aria's](https://react-spectrum.adobe.com/react-aria/useTable.html) useTable hook.  Here are just a couple of examples but you can check their docs for more. The compound component is composed of the exposed `Table`, `TableHeader`, `TableBody`, `Column`, `Row`, and `Cell` components, check the examples below to see how to use them.",
      },
    },
  },
  argTypes: {
    isStriped: {
      control: {
        type: 'boolean',
      },
    },
    isCompact: {
      control: {
        type: 'boolean',
      },
    },
    selectionMode: {
      control: {
        type: 'radio',
      },
      options: ['single', 'multiple', 'none'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Primary: Story = {
  name: 'Default Table',
  args: {
    isStriped: false,
    isCompact: false,
  },
  render: (args) => {
    return (
      <Table {...args} aria-label="Example static collection table">
        <TableHeader>
          {columns.map((column) => (
            <Column key={column.key} isRowHeader={column.isRowHeader}>
              {column.name}
            </Column>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id}>
              <Cell>{row.name}</Cell>
              <Cell>{row.type}</Cell>
              <Cell>{row.date}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const Striped: Story = {
  name: 'Striped Table',
  render: () => {
    return (
      <Table aria-label="Example static striped collection table" isStriped>
        <TableHeader columns={columns}>
          {(column) => (
            <Column isRowHeader={column.isRowHeader}>{column.name}</Column>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <Row>
              {(columnKey) => (
                <Cell>{item[columnKey as keyof typeof item]}</Cell>
              )}
            </Row>
          )}
        </TableBody>
      </Table>
    );
  },
};

export const Compact: Story = {
  name: 'Compact Table',
  render: () => {
    return (
      <Table aria-label="Example compact data table" isStriped isCompact>
        <TableHeader columns={columns}>
          {(column) => (
            <Column isRowHeader={column.isRowHeader}>{column.name}</Column>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <Row>
              {(columnKey) => (
                <Cell>{item[columnKey as keyof typeof item]}</Cell>
              )}
            </Row>
          )}
        </TableBody>
      </Table>
    );
  },
};

export const Link: Story = {
  name: 'Link Table',
  render: () => {
    return (
      <Table aria-label="Example link data table">
        <TableHeader columns={columns}>
          {(column) => (
            <Column isRowHeader={column.isRowHeader}>{column.name}</Column>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <Row href={item.href} target="_blank">
              {(columnKey) => (
                <Cell>{item[columnKey as keyof typeof item]}</Cell>
              )}
            </Row>
          )}
        </TableBody>
      </Table>
    );
  },
};

export const Sorting: Story = {
  /**
   * NOTE: This is a very basic implementation of sorting to demonstrate the
   * feature. Reference react-aria docs for more advanced examples:
   * https://react-spectrum.adobe.com/react-aria/useTable.html#sorting.
   */
  render: () => {
    const [items, setItems] = useState(rows);
    const [sortDescriptor, setSortDescriptor] = useState({});

    const sort = ({ column, direction }: SortDescriptor) => {
      setItems((items) =>
        [...items].sort((a, b) => {
          const first = a[column as keyof typeof a];
          const second = b[column as keyof typeof b];
          let cmp =
            (parseInt(first.toString()) || first) <
            (parseInt(second.toString()) || second)
              ? -1
              : 1;
          if (direction === 'descending') {
            cmp *= -1;
          }
          return cmp;
        }),
      );
      setSortDescriptor({ column, direction });
    };

    return (
      <Table
        aria-label="Example sortable data table"
        sortDescriptor={sortDescriptor}
        onSortChange={sort}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <Column allowsSorting isRowHeader={column.isRowHeader}>
              {column.name}
            </Column>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <Row>
              {(columnKey) => (
                <Cell>{item[columnKey as keyof typeof item]}</Cell>
              )}
            </Row>
          )}
        </TableBody>
      </Table>
    );
  },
};

export const FixedWidth: Story = {
  name: 'Table with Fixed column width',
  render: () => {
    return (
      <Table aria-label="Example table with nested columns">
        <TableHeader>
          <Column isRowHeader width="100">
            100px
          </Column>
          <Column width="50%">50%</Column>
          <Column>Normal</Column>
        </TableHeader>
        <TableBody>
          <Row>
            <Cell>Fixed column width.</Cell>
            <Cell>
              You can pass minWidth, maxWidth, and width props to the Column
              component to control the size of columns.
            </Cell>
            <Cell>
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
            </Cell>
          </Row>
        </TableBody>
      </Table>
    );
  },
};

export const NestedHeader: Story = {
  name: 'Table with Nested Columns',
  render: () => {
    return (
      <Table aria-label="Example table with nested columns">
        <TableHeader>
          <Column title="Name">
            <Column isRowHeader>First Name</Column>
            <Column isRowHeader>Last Name</Column>
          </Column>
          <Column title="Information">
            <Column>Age</Column>
            <Column>Birthday</Column>
          </Column>
        </TableHeader>
        <TableBody>
          <Row>
            <Cell>Sam</Cell>
            <Cell>Smith</Cell>
            <Cell>36</Cell>
            <Cell>May 3</Cell>
          </Row>
          <Row>
            <Cell>Julia</Cell>
            <Cell>Jones</Cell>
            <Cell>24</Cell>
            <Cell>February 10</Cell>
          </Row>
          <Row>
            <Cell>Peter</Cell>
            <Cell>Parker</Cell>
            <Cell>28</Cell>
            <Cell>September 7</Cell>
          </Row>
          <Row>
            <Cell>Bruce</Cell>
            <Cell>Wayne</Cell>
            <Cell>32</Cell>
            <Cell>December 18</Cell>
          </Row>
        </TableBody>
      </Table>
    );
  },
};
