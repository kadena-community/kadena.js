import { ProcuctIcons } from '../ProductIcons';

import { BreadcrumbItem, Breadcrumbs, IBreadcrumbs } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const ItemArray: string[] = [
  'He-man',
  'Skeletor',
  'Orko',
  'Teela-Na',
  'Cringer',
  'King Randor',
];

const meta: Meta<
  {
    itemsCount: number;
    selectIcon: keyof typeof ProcuctIcons;
  } & IBreadcrumbs
> = {
  title: 'Breadcrumbs',
  argTypes: {
    selectIcon: {
      options: Object.keys(ProcuctIcons) as (keyof typeof ProcuctIcons)[],
      control: {
        type: 'select',
      },
    },
    itemsCount: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    itemsCount: number;
    selectIcon: keyof typeof ProcuctIcons;
  } & IBreadcrumbs
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Breadcrumbs',
  args: {
    itemsCount: 3,
  },
  render: ({ itemsCount, selectIcon }) => {
    const items = ItemArray.slice(0, itemsCount);
    return (
      <Breadcrumbs icon={ProcuctIcons[selectIcon]}>
        {items.map((item, idx) => {
          return (
            <BreadcrumbItem key={item}>
              <a href={`#{item}`}>{item}</a>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumbs>
    );
  },
};
