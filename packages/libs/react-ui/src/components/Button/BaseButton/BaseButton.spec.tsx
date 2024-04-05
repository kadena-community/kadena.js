import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BaseButton } from './BaseButton';

import { afterEach, describe, expect, it, vi } from 'vitest';

describe('BaseButton', () => {
  const onPressSpy = vi.fn();
  const onPressStartSpy = vi.fn();
  const onPressEndSpy = vi.fn();
  const onPressUpSpy = vi.fn();
  const onPressChangeSpy = vi.fn();

  afterEach(() => {
    onPressSpy.mockClear();
  });

  it('should handle defaults', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const { getByRole, getByText } = render(
      <BaseButton onPress={onPressSpy}>Click Me</BaseButton>,
    );

    const button = getByRole('button');
    await user.click(button);
    expect(onPressSpy).toHaveBeenCalledTimes(1);

    const text = getByText('Click Me');
    expect(text).not.toBeNull();
  });

  it('Should support press events', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const { getByRole, getByText } = render(
      <BaseButton
        onPress={onPressSpy}
        onPressStart={onPressStartSpy}
        onPressEnd={onPressEndSpy}
        onPressUp={onPressUpSpy}
        onPressChange={onPressChangeSpy}
      >
        Click Me
      </BaseButton>,
    );

    const button = getByRole('button');
    await user.click(button);
    expect(onPressStartSpy).toHaveBeenCalledTimes(1);
    expect(onPressSpy).toHaveBeenCalledTimes(1);
    expect(onPressEndSpy).toHaveBeenCalledTimes(1);
    expect(onPressUpSpy).toHaveBeenCalledTimes(1);
    expect(onPressChangeSpy).toHaveBeenCalledTimes(2);

    const text = getByText('Click Me');
    expect(text).not.toBeNull();
  });

  it('Should allow custom props to be passed through to the button', () => {
    const { getByRole } = render(
      <BaseButton data-foo="bar">Click Me</BaseButton>,
    );
    const button = getByRole('button');
    expect(button).toHaveAttribute('data-foo', 'bar');
  });

  it('Should support aria-label', () => {
    const { getByRole } = render(<BaseButton aria-label="Test" />);
    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Test');
  });

  it('Should support aria-labelledby', () => {
    const { getByRole } = render(
      <>
        <span id="test">Test</span>
        <BaseButton aria-labelledby="test" />
      </>,
    );

    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-labelledby', 'test');
  });

  it('Should support aria-describedby', () => {
    const { getByRole } = render(
      <>
        <span id="test">Test</span>
        <BaseButton aria-describedby="test">Hi</BaseButton>
      </>,
    );

    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-describedby', 'test');
  });

  it('Should allow a custom className on the button', () => {
    const { getByRole } = render(
      <BaseButton className="x-men-first-class">Click Me</BaseButton>,
    );

    const button = getByRole('button');
    expect(button.getAttribute('class')).toEqual(
      expect.stringContaining('x-men-first-class'),
    );
  });

  it('Should not respond when disabled', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const { getByRole } = render(
      <BaseButton onPress={onPressSpy} isDisabled>
        Click Me
      </BaseButton>,
    );

    const button = getByRole('button');
    await user.click(button);
    expect(button).toBeDisabled();
    expect(onPressSpy).not.toHaveBeenCalled();
  });

  it('Should support autoFocus', () => {
    const { getByRole } = render(<BaseButton autoFocus>Click Me</BaseButton>);
    const button = getByRole('button');
    expect(document.activeElement).toBe(button);
  });
});
