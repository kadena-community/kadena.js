import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { Dialog } from './Dialog';

describe('Modal', () => {
  it('should render the provided children', () => {
    render(
      <Dialog isOpen>
        <div>Hello, world!</div>
      </Dialog>,
    );

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('should render the provided title', () => {
    render(
      <Dialog isOpen title="Title">
        <div>Hello, world!</div>
      </Dialog>,
    );

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveAttribute('role', 'dialog');
  });

  it('should use custom aria-label correctly', () => {
    render(
      <Dialog isOpen aria-label="my own label" title="only visual title">
        <div>Hello, world!</div>
      </Dialog>,
    );
    expect(screen.getByLabelText('my own label')).toHaveAttribute(
      'role',
      'dialog',
    );
  });

  it('should render the dialog when defaultOpen is true', () => {
    render(
      <Dialog defaultOpen>
        <div>Hello, world!</div>
      </Dialog>,
    );
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });
  it('should dismiss the dialog when the escape key is pressed', async () => {
    render(
      <Dialog defaultOpen>
        <div>Hello, world!</div>
      </Dialog>,
    );

    await userEvent.type(document.body, '{esc}');
    expect(screen.queryByText('Hello, world!')).not.toBeInTheDocument();
  });
});
