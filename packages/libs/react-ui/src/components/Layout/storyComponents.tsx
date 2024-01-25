import type { FC } from 'react';
import React from 'react';
import { tokens } from '../../styles/tokens/contract.css';
import { Text } from '../Typography';
import { Box } from './Box';
import { Stack } from './Stack';

export const defaultBoxArgs = {
  alignItems: undefined,
  borderRadius: undefined,
  bottom: undefined,
  cursor: undefined,
  display: undefined,
  flex: undefined,
  flexDirection: undefined,
  flexGrow: undefined,
  flexShrink: undefined,
  flexWrap: undefined,
  gap: undefined,
  height: undefined,
  inset: undefined,
  justifyContent: undefined,
  left: undefined,
  margin: undefined,
  marginBlock: undefined,
  marginBlockEnd: undefined,
  marginBlockStart: undefined,
  marginInline: undefined,
  marginInlineEnd: undefined,
  marginInlineStart: undefined,
  maxWidth: undefined,
  minWidth: undefined,
  overflow: undefined,
  padding: undefined,
  paddingBlock: undefined,
  paddingBlockEnd: undefined,
  paddingBlockStart: undefined,
  paddingInline: undefined,
  paddingInlineEnd: undefined,
  paddingInlineStart: undefined,
  position: undefined,
  right: undefined,
  textAlign: undefined,
  top: undefined,
  width: undefined,
  zIndex: undefined,
};

const spaceOptions = [undefined, ...Object.keys(tokens.kda.foundation.spacing)];
const marginOptions = [...spaceOptions, 'auto'];
export const sharedStoryArgTypes = {
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
};

export interface ILegendProps {
  items: Array<{ color: 'positive' | 'warning' | 'info'; label: string }>;
}

export const Legend: FC<ILegendProps> = ({ items }) => {
  return (
    <Stack
      as="ul"
      style={{ listStyle: 'none', padding: 0 }}
      gap="lg"
      position="absolute"
      right={0}
      bottom={0}
      marginBlock="sm"
      marginInline="md"
    >
      {items.map(({ color, label }) => (
        <Stack as="li" key={label} alignItems="center" gap="sm">
          <Box
            style={{ width: 15, height: 15 }}
            backgroundColor={`semantic.${color}.default`}
            borderColor="base.bold"
            borderStyle="solid"
            borderWidth="hairline"
          />
          <Text>{label}</Text>
        </Stack>
      ))}
    </Stack>
  );
};
