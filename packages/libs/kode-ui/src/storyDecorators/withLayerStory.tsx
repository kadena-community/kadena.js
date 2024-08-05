/*
  This Decorator can place the story on a colored layer from the design system.
  More info: https://storybook.js.org/docs/react/writing-stories/decorators
*/
import type { Decorator } from '@storybook/react';
import type { FC } from 'react';
import React from 'react';
import { Text } from '../components/Typography';
import { atoms } from '../styles/atoms.css';

interface IWithLayerStoryProps {
  children: React.ReactNode;
  layer: 'base' | 'layer' | 'surface';
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

export const onBackground: Decorator = (story) => (
  <div className={atoms({ backgroundColor: 'base.default' })}>{story()}</div>
);

export const onBase: Decorator = (story) => (
  <WithLayerStory layer="base">{story()}</WithLayerStory>
);

export const onLayer1: Decorator = (story) => (
  <WithLayerStory layer="base">{story()}</WithLayerStory>
);

export const onLayer2: Decorator = (story) => (
  <WithLayerStory layer="layer">{story()}</WithLayerStory>
);

export const onLayer3: Decorator = (story) => (
  <WithLayerStory layer="surface">{story()}</WithLayerStory>
);
