import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import {
  checkpointContainerStyle,
  circleColorVariant,
  circleLineContainerStyle,
  circleStyle,
  lineColorVariant,
  lineStyle,
  progressBarContentStyle,
  progressBarStyle,
  textColorVariant,
  textContainerStyle,
} from './ProgressBar.css';

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
      <div className={progressBarContentStyle}>
        {checkpoints.map((checkpoint, index) => {
          return (
            <>
              <div
                className={checkpointContainerStyle}
                key={index}
                data-testid={`kda-checkpoint-container-${index}`}
              >
                <div className={classNames(circleLineContainerStyle)}>
                  <div
                    className={classNames(
                      circleStyle,
                      circleColorVariant[checkpoint.status],
                    )}
                  />
                  {index !== checkpoints.length - 1 ? (
                    <div
                      className={classNames(
                        lineStyle,
                        lineColorVariant[checkpoints[index + 1].status],
                      )}
                    />
                  ) : null}
                </div>
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
    </div>
  );
};
