import { containerClass, contentClass, boxClas } from './stories.css';

import { Box, IBoxProps } from '@components/Box';
import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@theme/vars.css';
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
    padding: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    paddingX: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    paddingY: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    paddingTop: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    paddingBottom: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    paddingLeft: {
      options: selectOptions,
      control: {
        type: 'select',
      },
    },
    paddingRight: {
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
    padding: undefined,
    paddingX: undefined,
    paddingY: undefined,
    paddingTop: undefined,
    paddingBottom: undefined,
    paddingLeft: undefined,
    paddingRight: undefined,
  },
  render: ({
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
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
        padding={padding}
        paddingX={paddingX}
        paddingY={paddingY}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
      >
        <div className={contentClass}>Box Content</div>
      </Box>
    </div>
  ),
};
