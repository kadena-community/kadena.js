/*
  This Decorator can used to center the story.
  More info: https://storybook.js.org/docs/react/writing-stories/decorators
*/
import type { Decorator } from '@storybook/react';
import type { FC } from 'react';
import React from 'react';

interface ICenteredStoryProps {
  children: React.ReactNode;
  horizontal?: boolean;
  vertical?: boolean;
}
const CenteredStory: FC<ICenteredStoryProps> = ({
  horizontal,
  vertical,
  children,
}) => {
  return (
    <div
      style={{
        minHeight: '100%',
        width: '100%',
        display: 'flex',
        alignItems: vertical ? 'center' : 'flex-start',
        justifyContent: horizontal ? 'center' : 'flex-start',
        overflow: 'none',
      }}
    >
      {children}
    </div>
  );
};

export const withNotCenteredStory: Decorator = (story) => (
  <CenteredStory>{story()}</CenteredStory>
);
export const withCenteredStory: Decorator = (story) => (
  <CenteredStory horizontal vertical>
    {story()}
  </CenteredStory>
);
export const withHorizontallyCenteredStory: Decorator = (story) => (
  <CenteredStory horizontal>{story()}</CenteredStory>
);
export const withVerticallyCenteredStory: Decorator = (story) => (
  <CenteredStory vertical>{story()}</CenteredStory>
);
