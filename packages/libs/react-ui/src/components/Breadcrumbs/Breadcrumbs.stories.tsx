import type { IBreadcrumbsProps } from '@components/Breadcrumbs';
import { Breadcrumbs } from '@components/Breadcrumbs';
import { ProductIcon } from '@components/Icon';
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
    selectIcon: keyof typeof ProductIcon;
  } & IBreadcrumbsProps
> = {
  title: 'Components/Breadcrumbs',
  argTypes: {
    selectIcon: {
      options: Object.keys(ProductIcon) as (keyof typeof ProductIcon)[],
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
    selectIcon: keyof typeof ProductIcon;
  } & IBreadcrumbsProps
>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Breadcrumbs',
  args: {
    selectIcon: 'KadenaOverview',
    itemsCount: 3,
  },
  render: ({ itemsCount, selectIcon }) => {
    const items = ItemArray.slice(0, itemsCount);
    const Icon = ProductIcon[selectIcon];
    return (
      <Breadcrumbs.Root icon={Icon}>
        {items.map((item, idx) => {
          return (
            <Breadcrumbs.Item
              key={item}
              href={idx < items.length - 1 ? item : undefined}
            >
              {item}
            </Breadcrumbs.Item>
          );
        })}
      </Breadcrumbs.Root>
    );
  },
};
