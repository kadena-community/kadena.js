import type { IBoxProps } from '@components/Layout/Box';
import { Box } from '@components/Layout/Box';
import type { Meta, StoryObj } from '@storybook/react';
import { vars } from '@theme/vars.css';
import React from 'react';
import { containerClass, itemClass } from '../stories.css';

const spaceOptions: (keyof typeof vars.sizes | undefined)[] = [
  undefined,
  ...(Object.keys(vars.sizes) as (keyof typeof vars.sizes)[]),
];
const contentWidthOptions: (keyof typeof vars.contentWidth | undefined)[] = [
  undefined,
  ...(Object.keys(vars.contentWidth) as (keyof typeof vars.contentWidth)[]),
];
const dimensionOptions: string[] = ['100%', 'min-content', 'max-content'];

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
    width: {
      options: [...spaceOptions, ...dimensionOptions, ...contentWidthOptions],
      control: {
        type: 'select',
      },
      description: 'Value for width property with pre-defined size values.',
    },
    minWidth: {
      options: dimensionOptions,
      control: {
        type: 'select',
      },
      description: 'Value for minWidth property with pre-defined size values.',
    },
    maxWidth: {
      options: [...dimensionOptions, ...contentWidthOptions],
      control: {
        type: 'select',
      },
      description: 'Value for maxWidth property with pre-defined size values.',
    },
    height: {
      options: [...spaceOptions, ...dimensionOptions],
      control: {
        type: 'select',
      },
      description: 'Value for height property with pre-defined size values.',
    },
    minHeight: {
      options: dimensionOptions,
      control: {
        type: 'select',
      },
      description: 'Value for minHeight property with pre-defined size values.',
    },
    maxHeight: {
      options: dimensionOptions,
      control: {
        type: 'select',
      },
      description: 'Value for maxHeight property with pre-defined size values.',
    },
    margin: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description: 'Value for margin property with pre-defined size values.',
    },
    marginX: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for margin property on X axis with pre-defined size values.',
    },
    marginY: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for margin property on Y axis with pre-defined size values.',
    },
    marginTop: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for top margin property with pre-defined size values.',
    },
    marginBottom: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for top margin property with pre-defined size values.',
    },

    marginLeft: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for left margin property with pre-defined size values.',
    },
    marginRight: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for right margin property with pre-defined size values.',
    },
    padding: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description: 'Value for padding property with pre-defined size values.',
    },
    paddingX: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for padding property on X axis with pre-defined size values.',
    },
    paddingY: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for padding property on Y axis with pre-defined size values.',
    },
    paddingTop: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for top padding property with pre-defined size values.',
    },
    paddingBottom: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for bottom padding property with pre-defined size values.',
    },
    paddingLeft: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
      description:
        'Value for left padding property with pre-defined size values.',
    },
    paddingRight: {
      options: spaceOptions,
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
    width: undefined,
    minWidth: undefined,
    maxWidth: undefined,
    height: undefined,
    minHeight: undefined,
    maxHeight: undefined,
  },
  render: ({
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    padding = '$6',
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
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
        width={width}
        minWidth={minWidth}
        maxWidth={maxWidth}
        height={height}
        minHeight={minHeight}
        maxHeight={maxHeight}
        className={itemClass}
      >
        Box Content
      </Box>
    </div>
  ),
};
