import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, test } from 'vitest';
import type { ICheckpoint } from './ProgressBar';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  let checkpoints: ICheckpoint[];
  beforeEach(() => {
    checkpoints = [
      {
        title: 'Checkpoint 1',
        status: 'complete',
      },
      {
        title: 'Checkpoint 2',
        status: 'pending',
      },
      {
        title: 'Checkpoint 3',
        status: 'incomplete',
      },
    ];
  });

  test('renders correctly', () => {
    const { getByTestId } = render(<ProgressBar checkpoints={checkpoints} />);
    const progressBar = getByTestId('kda-progress-bar');
    const firstCheckpointContainer = getByTestId('kda-checkpoint-container-0');
    const secondCheckpointContainer = getByTestId('kda-checkpoint-container-1');
    const thirdCheckpointContainer = getByTestId('kda-checkpoint-container-2');

    expect(progressBar).toBeInTheDocument();
    expect(firstCheckpointContainer).toBeInTheDocument();
    expect(secondCheckpointContainer).toBeInTheDocument();
    expect(thirdCheckpointContainer).toBeInTheDocument();
  });

  test('displays correct content', () => {
    render(<ProgressBar checkpoints={checkpoints} />);

    expect(screen.getByText('Checkpoint 1')).toBeInTheDocument();
    expect(screen.getByText('Checkpoint 2')).toBeInTheDocument();
    expect(screen.getByText('Checkpoint 3')).toBeInTheDocument();
  });

  test('displays correct number of checkpoints', () => {
    const { getByTestId } = render(
      <ProgressBar checkpoints={checkpoints.splice(0, 2)} />,
    );

    const firstCheckpointContainer = getByTestId('kda-checkpoint-container-0');
    const secondCheckpointContainer = getByTestId('kda-checkpoint-container-1');

    expect(firstCheckpointContainer).toBeInTheDocument();
    expect(secondCheckpointContainer).toBeInTheDocument();

    expect(
      screen.queryByTestId('kda-checkpoint-container-2'),
    ).not.toBeInTheDocument();
  });
});
