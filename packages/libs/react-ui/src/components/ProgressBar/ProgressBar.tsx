import {
  checkpointContainerStyle,
  circleColorVariant,
  circleStyle,
  lineColorVariant,
  lineContainerStyle,
  lineStyle,
  progressBarStyle,
  textColorVariant,
  textContainerStyle,
} from './ProgressBar.css';

import classNames from 'classnames';
import React, { FC } from 'react';

export interface IProgressBarProps {
  checkpoints: ICheckpoint[];
}

export interface ICheckpoint {
  title: string;
  status: 'complete' | 'pending' | 'incomplete';
}

export const ProgressBar: FC<IProgressBarProps> = ({ checkpoints }) => {
  return (
    <div className={progressBarStyle} data-testid="kda-progress-bar">
      {checkpoints.map((checkpoint, index) => {
        return (
          <>
            {index !== 0 ? (
              <div className={lineContainerStyle}>
                <div
                  className={classNames(
                    lineStyle,
                    lineColorVariant[checkpoint.status],
                  )}
                />
                <div
                  className={classNames(
                    lineStyle,
                    lineColorVariant[checkpoint.status],
                  )}
                />
                <div
                  className={classNames(
                    lineStyle,
                    lineColorVariant[checkpoint.status],
                  )}
                />
              </div>
            ) : null}
            <div
              className={checkpointContainerStyle}
              key={index}
              data-testid={`kda-checkpoint-container-${index}`}
            >
              <div
                className={classNames(
                  circleStyle,
                  circleColorVariant[checkpoint.status],
                )}
              />
              <div
                className={classNames(
                  textContainerStyle,
                  textColorVariant[checkpoint.status],
                )}
              >
                {checkpoint.title}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default ProgressBar;
