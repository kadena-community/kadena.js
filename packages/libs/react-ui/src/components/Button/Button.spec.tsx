import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { Button } from './Button';

import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Button', () => {
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
      <Button onPress={onPressSpy}>Click Me</Button>,
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
      <Button
        onPress={onPressSpy}
        onPressStart={onPressStartSpy}
        onPressEnd={onPressEndSpy}
        onPressUp={onPressUpSpy}
        onPressChange={onPressChangeSpy}
      >
        Click Me
      </Button>,
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
    const { getByRole } = render(<Button data-foo="bar">Click Me</Button>);
    const button = getByRole('button');
    expect(button).toHaveAttribute('data-foo', 'bar');
  });

  it('Should support aria-label', () => {
    const { getByRole } = render(<Button aria-label="Test" />);
    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Test');
  });

  it('Should support aria-labelledby', () => {
    const { getByRole } = render(
      <>
        <span id="test">Test</span>
        <Button aria-labelledby="test" />
      </>,
    );

    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-labelledby', 'test');
  });

  it('Should support aria-describedby', () => {
    const { getByRole } = render(
      <>
        <span id="test">Test</span>
        <Button aria-describedby="test">Hi</Button>
      </>,
    );

    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-describedby', 'test');
  });

  it('Should allow a custom className on the button', () => {
    const { getByRole } = render(
      <Button className="x-men-first-class">Click Me</Button>,
    );

    const button = getByRole('button');
    expect(button.getAttribute('class')).toEqual(
      expect.stringContaining('x-men-first-class'),
    );
  });

  it('Should not respond when disabled', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const { getByRole } = render(
      <Button onPress={onPressSpy} isDisabled>
        Click Me
      </Button>,
    );

    const button = getByRole('button');
    await user.click(button);
    expect(button).toBeDisabled();
    expect(onPressSpy).not.toHaveBeenCalled();
  });

  it('Should support autoFocus', () => {
    const { getByRole } = render(<Button autoFocus>Click Me</Button>);
    const button = getByRole('button');
    expect(document.activeElement).toBe(button);
  });

  it('Should display a spinner when isLoading prop is true', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onPressSpy = vi.fn();
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const TestComponent = () => {
      const [pending, setPending] = useState(false);
      return (
        <Button
          onPress={(e) => {
            setPending(true);
            onPressSpy();
          }}
          isLoading={pending}
        >
          Click me
        </Button>
      );
    };
    const { getByRole, queryByRole } = render(<TestComponent />);
    const button = getByRole('button');
    expect(button).not.toHaveAttribute('aria-disabled');
    await user.click(button);

    // Button is disabled immediately and spinner is visible
    expect(button).toHaveAttribute('aria-disabled', 'true');
    const spinner = queryByRole('progressbar');
    expect(spinner).toBeVisible();

    // Multiple clicks shouldn't call onPressSpy
    await user.click(button);
    expect(onPressSpy).toHaveBeenCalledTimes(1);
  });
});
