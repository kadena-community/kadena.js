/*
  This Decorator can place the story on a colored layer from the design system.
  More info: https://storybook.js.org/docs/react/writing-stories/decorators
*/
import { Text } from '@components/Typography';
import type { Decorator } from '@storybook/react';
import { atoms } from '@theme/atoms.css';
import type { FC } from 'react';
import React from 'react';

interface IWithLayerStoryProps {
  children: React.ReactNode;
  layer: 'base' | 'layer-1' | 'layer-2' | 'layer-3';
}
const WithLayerStory: FC<IWithLayerStoryProps> = ({ children, layer }) => {
  return (
    <div
      className={atoms({
        position: 'relative',
        backgroundColor: `${layer}.default`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        padding: 'xxxl',
      })}
      style={{ minHeight: '20rem' }}
    >
      <Text
        variant="base"
        bold
        className={atoms({
          position: 'absolute',
          top: 0,
          left: 0,
          margin: 'md',
          marginBlock: 'sm',
        })}
      >
        {layer}
      </Text>
      {children}
    </div>
  );
};

export const onBase: Decorator = (story) => (
  <WithLayerStory layer="base">{story()}</WithLayerStory>
);

export const onLayer1: Decorator = (story) => (
  <WithLayerStory layer="layer-1">{story()}</WithLayerStory>
);

export const onLayer2: Decorator = (story) => (
  <WithLayerStory layer="layer-2">{story()}</WithLayerStory>
);

export const onLayer3: Decorator = (story) => (
  <WithLayerStory layer="layer-3">{story()}</WithLayerStory>
);
