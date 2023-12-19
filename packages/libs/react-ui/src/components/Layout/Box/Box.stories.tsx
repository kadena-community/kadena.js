import type { IBoxProps } from '@components/Layout/Box';
import { Box } from '@components/Layout/Box';
import { onLayer2 } from '@storyDecorators';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '@theme/tokens/contract.css';
import React from 'react';
import { componentClass, containerClass, itemClass } from '../stories.css';

const spaceOptions = [undefined, ...Object.keys(tokens.kda.foundation.spacing)];
const marginOptions = [...spaceOptions, 'auto'];

const meta: Meta<IBoxProps> = {
  title: 'Layout/Box',
  component: Box,
  decorators: [onLayer2],
  parameters: {
    status: {
      type: 'stable',
    },
    docs: {
      description: {
        component:
          'Box is the most basic building block of application layout.\n' +
          '\nThis component accepts an `as` prop which allows the user to pass what html element the `Box` will render as well as many style attributes that are mapped to css utility classes.',
      },
    },
  },
  argTypes: {
    overflow: {
      options: ['hidden', 'visible', 'scroll', 'auto'],
      control: {
        type: 'select',
      },
      description: 'Overflow css property.',
    },
    gap: {
      options: spaceOptions,
    },
    width: {
      options: [undefined, '100%'],
      control: {
        type: 'select',
      },
    },
    minWidth: {
      options: [undefined, 'content.minWidth'],
      control: {
        type: 'select',
      },
    },
    maxWidth: {
      options: [undefined, 'content.maxWidth'],
      control: {
        type: 'select',
      },
    },
    height: {
      options: [undefined, '100%'],
      control: {
        type: 'select',
      },
    },
    margin: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    marginInline: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    marginBlock: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    marginBlockStart: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    marginBlockEnd: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    marginInlineStart: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    marginInlineEnd: {
      options: marginOptions,
      control: {
        type: 'select',
      },
    },
    padding: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingInline: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingBlock: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingBlockStart: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingBlockEnd: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingInlineStart: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
    paddingInlineEnd: {
      options: spaceOptions,
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<IBoxProps>;

export const Primary: Story = {
  name: 'Box - Margin',
  args: {
    margin: undefined,
    marginInline: undefined,
    marginBlock: undefined,
    marginBlockStart: undefined,
    marginBlockEnd: undefined,
    marginInlineStart: undefined,
    marginInlineEnd: undefined,
    padding: undefined,
    paddingInline: undefined,
    paddingBlock: undefined,
    paddingBlockStart: undefined,
    paddingBlockEnd: undefined,
    paddingInlineStart: undefined,
    paddingInlineEnd: undefined,
    width: undefined,
    minWidth: undefined,
    maxWidth: undefined,
    height: undefined,
    gap: undefined,
  },
  render: ({
    margin,
    marginInline,
    marginBlock,
    marginBlockStart,
    marginBlockEnd,
    marginInlineStart,
    marginInlineEnd,
    padding,
    paddingInline,
    paddingBlock,
    paddingBlockStart,
    paddingBlockEnd,
    paddingInlineStart,
    paddingInlineEnd,
    width,
    minWidth,
    maxWidth,
    height,
    overflow,
    gap,
  }) => (
    <div className={containerClass}>
      <Box
        margin={margin}
        marginInline={marginInline}
        marginBlock={marginBlock}
        marginBlockStart={marginBlockStart}
        marginBlockEnd={marginBlockEnd}
        marginInlineStart={marginInlineStart}
        marginInlineEnd={marginInlineEnd}
        padding={padding}
        paddingInline={paddingInline}
        paddingBlock={paddingBlock}
        paddingBlockStart={paddingBlockStart}
        paddingBlockEnd={paddingBlockEnd}
        paddingInlineStart={paddingInlineStart}
        paddingInlineEnd={paddingInlineEnd}
        width={width}
        minWidth={minWidth}
        maxWidth={maxWidth}
        height={height}
        overflow={overflow}
        gap={gap}
        className={componentClass}
      >
        <div className={itemClass}>Box Content</div>
      </Box>
    </div>
  ),
};
