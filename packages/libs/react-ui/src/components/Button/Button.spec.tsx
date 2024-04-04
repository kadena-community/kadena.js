import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { Button } from './Button';

import { afterEach, describe, expect, it, vi } from 'vitest';

const iconLabel = 'icon';
const icon = <span>{iconLabel}</span>;

describe('Button', () => {
  const onPressSpy = vi.fn();

  afterEach(() => {
    onPressSpy.mockClear();
  });

  it('should render an avatar if start icon and avatar are provided', async () => {
    const TestComponentWithAvatar = () => {
      return (
        <Button
          icon={icon}
          iconPosition="start"
          avatarProps={{ name: 'Robin Mulder' }}
          onPress={() => {
            onPressSpy();
          }}
        >
          Click me
        </Button>
      );
    };

    const { getByRole, getByText } = render(<TestComponentWithAvatar />);
    const button = getByRole('button');

    button.childNodes.forEach((child) => {
      if (child.textContent === iconLabel) {
        expect(child).not.toBeVisible();
      }
    });

    // check if avatar is present
    expect(getByText('RM')).toBeVisible();
  });

  it('should render an end icon', async () => {
    const TestComponent = () => {
      return (
        <Button
          icon={icon}
          onPress={() => {
            onPressSpy();
          }}
        >
          Click me
        </Button>
      );
    };

    const { getByText } = render(<TestComponent />);

    const iconElement = getByText(iconLabel);

    expect(iconElement).toBeVisible();

    const label = getByText('Click me');
    expect(label.nextSibling?.textContent).toBe(iconLabel);
  });

  it('should render a start icon', async () => {
    const TestComponent = () => {
      return (
        <Button
          icon={icon}
          iconPosition="start"
          onPress={() => {
            onPressSpy();
          }}
        >
          Click me
        </Button>
      );
    };

    const { getByText } = render(<TestComponent />);

    const iconElement = getByText(iconLabel);

    expect(iconElement).toBeVisible();

    const label = getByText('Click me');
    expect(label.previousSibling?.textContent).toBe(iconLabel);
  });

  it('should render a badge component', async () => {
    const TestComponent = () => {
      return (
        <Button
          badgeValue={6}
          onPress={() => {
            onPressSpy();
          }}
        >
          Click me
        </Button>
      );
    };

    const { getByText } = render(<TestComponent />);

    const badgeElement = getByText(6);

    expect(badgeElement).toBeVisible();
  });

  it('should render an icon only', async () => {
    const TestComponent = () => {
      return (
        <Button
          icon={icon}
          onPress={() => {
            onPressSpy();
          }}
        ></Button>
      );
    };

    const { getByText } = render(<TestComponent />);

    expect(getByText(iconLabel)).toBeVisible();
  });

  it('Should display a spinner when isLoading prop is true', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onPressSpy = vi.fn();

    const TestComponent = () => {
      const [pending, setPending] = useState(false);
      return (
        <Button
          onPress={() => {
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
