import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { IBreadcrumbsProps } from '../Breadcrumbs';
import { ProductIcon } from '../Icon';
import { Breadcrumbs } from './Breadcrumbs';
import { BreadcrumbsItem } from './BreadcrumbsItem';

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
    icon: keyof typeof ProductIcon;
  } & IBreadcrumbsProps
> = {
  title: 'Navigation/Breadcrumbs',
  parameters: {
    status: { type: 'releaseCandidate' },
    docs: {
      description: {
        component:
          'The Breadcrumb component displays the position of the current page within the site hierarchy, allowing page visitors to navigate the page hierarchy from their current location. It is composed by Breadcrumbs and BreadcrumbsItem.<br><br><i>Note: In times when you need to use an external `Link` component (like next/link in Next.js), you can wrap the external component in BreadcrumbsItem and set the `asChild` prop to pass on styles and props to the child component.</i>',
      },
    },
  },
  argTypes: {
    icon: {
      description:
        'An icon displayed to the left of the breadcrumb items. This prop accepts a ReactNode.',
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
    icon: <ProductIcon.KadenaOverview />,
    itemsCount: 3,
  },
  render: ({ itemsCount, icon }) => {
    const items = ItemArray.slice(0, itemsCount);
    return (
      <Breadcrumbs icon={icon}>
        {items.map((item, idx) => {
          return (
            <BreadcrumbsItem
              key={item}
              href={idx < items.length - 1 ? item : undefined}
              isDisabled={idx % 2 === 1}
            >
              {item}
            </BreadcrumbsItem>
          );
        })}
      </Breadcrumbs>
    );
  },
};
