import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ProgressCircle } from './ProgressCircle';

describe('ProgressCircle', () => {
  it('Should handle defaults', () => {
    const { getByRole } = render(<ProgressCircle aria-label="Progress" />);
    const progressCircle = getByRole('progressbar');
    expect(progressCircle).toHaveAttribute('aria-valuemin', '0');
    expect(progressCircle).toHaveAttribute('aria-valuemax', '100');
    expect(progressCircle).toHaveAttribute('aria-valuenow', '0');
  });

  it('Should handle indeterminate', () => {
    const { getByRole } = render(
      <ProgressCircle aria-label="Progress" isIndeterminate />,
    );
    const progressCircle = getByRole('progressbar');
    expect(progressCircle).toHaveAttribute('aria-valuemin', '0');
    expect(progressCircle).toHaveAttribute('aria-valuemax', '100');
    expect(progressCircle).not.toHaveAttribute('aria-valuenow');
  });

  it('Should handle controlled value', () => {
    const { getByRole } = render(
      <ProgressCircle aria-label="Progress" value={30} />,
    );
    const progressCircle = getByRole('progressbar');
    expect(progressCircle).toHaveAttribute('aria-valuemin', '0');
    expect(progressCircle).toHaveAttribute('aria-valuemax', '100');
    expect(progressCircle).toHaveAttribute('aria-valuenow', '30');
  });

  it('Should clamp values to 0', () => {
    const { getByRole } = render(
      <ProgressCircle aria-label="Progress" value={-1} />,
    );
    const progressCircle = getByRole('progressbar');
    expect(progressCircle).toHaveAttribute('aria-valuenow', '0');
  });

  it('Should clamp values to 100', () => {
    const { getByRole } = render(
      <ProgressCircle aria-label="Progress" value={1000} />,
    );
    const progressCircle = getByRole('progressbar');
    expect(progressCircle).toHaveAttribute('aria-valuenow', '100');
  });

  it('Should support className', () => {
    const { getByRole } = render(
      <ProgressCircle aria-label="Progress" className="testClass" />,
    );
    const progressCircle = getByRole('progressbar');
    expect(progressCircle).toHaveAttribute(
      'class',
      expect.stringContaining('testClass'),
    );
  });

  it('can handle negative values with minValue and maxValue', () => {
    const { getByRole } = render(
      <ProgressCircle
        aria-label="Progress"
        value={0}
        minValue={-5}
        maxValue={5}
      />,
    );
    const progressBar = getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuetext', '50%');
  });

  it('warns user if no aria-label is provided', () => {
    const spyWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ProgressCircle value={25} />);
    expect(spyWarn).toHaveBeenCalledWith(
      'If you do not provide a visible label, you must specify an aria-label or aria-labelledby attribute for accessibility',
    );
  });

  it('supports custom DOM props', () => {
    const { getByTestId } = render(
      <ProgressCircle value={25} aria-label="Progress" data-testid="test" />,
    );
    const progressBar = getByTestId('test');
    expect(progressBar).toBeInTheDocument();
  });
});
