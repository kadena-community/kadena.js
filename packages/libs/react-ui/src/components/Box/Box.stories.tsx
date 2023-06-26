import { vars } from '../../styles';

import { Box, IBoxProps } from './Box';
import { containerClass, contentClass } from './stories.css';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const selectOptions: (keyof typeof vars.sizes | undefined)[] = [
  undefined,
  ...(Object.keys(vars.sizes) as (keyof typeof vars.sizes)[]),
];

const meta: Meta<IBoxProps> = {
  title: 'Layout/Box',
  argTypes: {
    margin: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    marginX: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    marginY: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    marginTop: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    marginBottom: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },

    marginLeft: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    marginRight: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<IBoxProps>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Box - Margin',
  args: {
    margin: undefined,
    marginX: undefined,
    marginY: undefined,
    marginTop: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
    marginRight: undefined,
  },
  render: ({
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  }) => (
    <div className={containerClass}>
      <Box
        margin={margin}
        marginX={marginX}
        marginY={marginY}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight}
      >
        <div className={contentClass}>Box</div>
      </Box>
    </div>
  ),
};
