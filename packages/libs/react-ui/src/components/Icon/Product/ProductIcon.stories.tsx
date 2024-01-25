import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ProductIcon } from '..';
import type { IIconProps } from '../IconWrapper';
import { sizeVariants } from '../IconWrapper.css';
import { gridContainer, gridItem } from '../stories.css';

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */
const meta: Meta<{ icon: string } & IIconProps> = {
  title: 'Icons/ProductIcons',
  parameters: {
    status: {
      type: ['needsRevision'],
    },
  },
  argTypes: {
    icon: {
      control: {
        type: 'text',
      },
    },
    size: {
      options: Object.keys(sizeVariants) as (keyof typeof sizeVariants)[],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<{ icon: string } & IIconProps>;

export const Primary: Story = {
  name: 'Product',
  args: {
    icon: '',
    size: 'md',
  },
  render: ({ icon, size }) => {
    // eslint-disable-next-line @rushstack/security/no-unsafe-regexp
    const searchRegexp = new RegExp(icon, 'i');
    return (
      <div className={gridContainer}>
        {Object.entries(ProductIcon)
          .filter(([k]) => searchRegexp.test(k))
          // eslint-disable-next-line @typescript-eslint/naming-convention
          .map(([k, Icon]) => (
            <div key={k} className={gridItem}>
              <Icon size={size} />
              <span>{k}</span>
            </div>
          ))}
      </div>
    );
  },
};
