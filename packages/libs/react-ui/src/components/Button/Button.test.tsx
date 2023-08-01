import { Button } from '@components/Button';
import { render } from '@testing-library/react';
import React from 'react';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <Button title="Button">Hello, Button!</Button>,
    );

    const buttonContainer = getByTestId('kda-button');
    expect(buttonContainer).toBeInTheDocument();
  });

  it('disables the button when `disabled` prop is true', () => {
    const { getByTestId } = render(
      <Button title="Button" disabled>
        Hello, Button!
      </Button>,
    );

    const buttonContainer = getByTestId('kda-button') as HTMLButtonElement;

    expect(buttonContainer.disabled).toBe(true);
  });

  it('renders as an anchor element when `as` prop = "a"', () => {
    const { getByTestId } = render(
      <Button title="Button" as="a" href="https://kadena.io/">
        Hello, Button!
      </Button>,
    );

    const buttonContainer = getByTestId('kda-button') as HTMLAnchorElement;

    expect(buttonContainer.nodeName === 'A').toBe(true);
  });

  it('requires the `href` prop to be set when rendered as anchor', () => {
    const { getByTestId } = render(
      <Button title="Button" as="a">
        Hello, Button!
      </Button>,
    );

    const buttonContainer = getByTestId('kda-button') as HTMLAnchorElement;

    expect(buttonContainer.nodeName === 'BUTTON').toBe(true);
  });
});
