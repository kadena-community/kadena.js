import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { Dialog } from '@components/Dialog';

describe('Modal', () => {
  it('should render the provided children', () => {
    render(
      <Dialog.Root isOpen>
        <Dialog.Content>Hello, world!</Dialog.Content>
      </Dialog.Root>,
    );

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('should render the provided title', () => {
    render(
      <Dialog.Root isOpen>
        <Dialog.Header>Title</Dialog.Header>
        <Dialog.Content>Hello, world!</Dialog.Content>
      </Dialog.Root>,
    );

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveAttribute('role', 'dialog');
  });

  it('should use custom aria-label correctly', () => {
    render(
      <Dialog.Root isOpen aria-label="my own label">
        <Dialog.Header>Only Visual Title</Dialog.Header>
        <Dialog.Content>Hello, world!</Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getByLabelText('my own label')).toHaveAttribute(
      'role',
      'dialog',
    );
  });

  it('should render the dialog when defaultOpen is true', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>Hello, world!</Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });
  it('should dismiss the dialog when the escape key is pressed', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>Hello, world!</Dialog.Content>
      </Dialog.Root>,
    );

    await userEvent.type(document.body, '{esc}');
    expect(screen.queryByText('Hello, world!')).not.toBeInTheDocument();
  });
});
