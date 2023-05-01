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
  } & IBreadcrumbs
> = {
  title: 'Breadcrumbs',
  argTypes: {
    itemsCount: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<
  {
    itemsCount: number;
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
  render: ({ itemsCount }) => {
    return (
      <Breadcrumbs>
        {Array.from(Array(itemsCount).keys()).map((i) => {
          return (
            <BreadcrumbItem key={i}>
              <a href={`#{ItemArray[i]}`}>{ItemArray[i]}</a>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumbs>
    );
  },
};
