import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button, ButtonGroup, Stack, Text } from './../../..';
import { token } from './../../../../styles';
import { useTheme } from './../../../../utils';
import type { IThemeAnimateIconProps } from './ThemeAnimateIcon';
import { ThemeAnimateIcon } from './ThemeAnimateIcon';

const meta: Meta<IThemeAnimateIconProps> = {
  title: 'Icons/AnimatedIcons/ThemeAnimateIcon',
  parameters: {
    status: { type: 'experimental' },
    docs: {
      description: {
        component:
          'ThemeAnimateIcon is a component that can be used as the icon for changing themes',
      },
    },
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<IThemeAnimateIconProps>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  name: 'Button Icon Amimation',
  args: {},

  render: () => {
    const { rotateThemeState, rotateTheme } = useTheme();

    return (
      <Stack
        flexDirection="column"
        gap="md"
        width="100%"
        justifyContent="center"
        alignItems="center"
        style={{
          height: '300px',
          backgroundColor: token('color.background.base.default'),
        }}
      >
        <Text variant="code">{rotateThemeState}</Text>
        <ButtonGroup>
          <Button isCompact variant="outlined" onPress={() => {}}>
            Press
          </Button>
          <Button
            isCompact
            variant="outlined"
            onPress={rotateTheme}
            endVisual={<ThemeAnimateIcon theme={rotateThemeState} />}
          />
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="outlined" onPress={() => {}}>
            Press
          </Button>
          <Button
            variant="outlined"
            onPress={rotateTheme}
            endVisual={<ThemeAnimateIcon theme={rotateThemeState} />}
          />
        </ButtonGroup>
      </Stack>
    );
  },
};
