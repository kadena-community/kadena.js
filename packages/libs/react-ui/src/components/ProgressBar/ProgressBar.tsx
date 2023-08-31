import {
  checkpointContainerStyle,
  circleColorVariant,
  circleLineContainerStyle,
  circleStyle,
  gapLineContainerStyle,
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
              <div className={gapLineContainerStyle}>
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
              <div className={circleLineContainerStyle}>
                {index !== 0 ? (
                  <div className={lineContainerStyle}>
                    <div
                      className={classNames(
                        lineStyle,
                        lineColorVariant[checkpoint.status],
                      )}
                    />
                  </div>
                ) : (
                  <div className={lineContainerStyle} />
                )}
                <div
                  className={classNames(
                    circleStyle,
                    circleColorVariant[checkpoint.status],
                  )}
                />
                {index !== checkpoints.length - 1 ? (
                  <div className={lineContainerStyle}>
                    <div
                      className={classNames(
                        lineStyle,
                        lineColorVariant[checkpoint.status],
                      )}
                    />
                  </div>
                ) : (
                  <div className={lineContainerStyle} />
                )}
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
  );
};

export default ProgressBar;
