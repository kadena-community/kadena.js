import { containerClass, contentClass } from './stories.css';

import type { IBoxProps } from '@components/Box';
import { Box } from '@components/Box';
import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@theme/vars.css';
import React from 'react';

const selectOptions: (keyof typeof vars.sizes | undefined)[] = [
  undefined,
  ...(Object.keys(vars.sizes) as (keyof typeof vars.sizes)[]),
];

const meta: Meta<IBoxProps> = {
  title: 'Layout/Box',
  parameters: {
    docs: {
      description: {
        component:
          'Box is the most basic building block of application layout.\n' +
          '\nThis component allows for passing the <i>display</i>, <i>margin</i> and <i>padding</i> properties.',
      },
    },
  },
  argTypes: {
    margin: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description: 'Value for margin property with pre-defined size values.',
    },
    marginX: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for margin property on X axis with pre-defined size values.',
    },
    marginY: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for margin property on Y axis with pre-defined size values.',
    },
    marginTop: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for top margin property with pre-defined size values.',
    },
    marginBottom: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for top margin property with pre-defined size values.',
    },

    marginLeft: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for left margin property with pre-defined size values.',
    },
    marginRight: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for right margin property with pre-defined size values.',
    },
    padding: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description: 'Value for padding property with pre-defined size values.',
    },
    paddingX: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for padding property on X axis with pre-defined size values.',
    },
    paddingY: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for padding property on Y axis with pre-defined size values.',
    },
    paddingTop: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for top padding property with pre-defined size values.',
    },
    paddingBottom: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for bottom padding property with pre-defined size values.',
    },
    paddingLeft: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for left padding property with pre-defined size values.',
    },
    paddingRight: {
      options: selectOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for right padding property with pre-defined size values.',
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
