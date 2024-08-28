import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FC } from 'react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useOverlayTriggerState } from 'react-stately';
import type { IModalProps } from './Modal';
import { Modal } from './Modal';

interface ITestBedProps extends Omit<IModalProps, 'state'> {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}
const TestBed: FC<ITestBedProps> = ({
  isOpen,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}) => {
  const state = useOverlayTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  });
  return (
    <Modal state={state} {...props}>
      {children}
    </Modal>
  );
};
describe('Modal', () => {
  it('should render the provided children', () => {
    render(
      <TestBed isOpen>
        <div>Hello, world!</div>
      </TestBed>,
    );

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('should render the modal when defaultOpen is true', () => {
    render(
      <TestBed defaultOpen>
        <div>Hello, world!</div>
      </TestBed>,
    );
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });
  it('should dismiss the modal when the escape key is pressed', async () => {
    render(
      <TestBed defaultOpen>
        <div>Hello, world!</div>
      </TestBed>,
    );
    await userEvent.type(document.body, '{esc}');
    expect(screen.queryByText('Hello, world!')).not.toBeInTheDocument();
  });

  it('should not dismiss the modal isDismissable is false', async () => {
    const onClose = vi.fn();
    const TestBed2: FC = () => {
      const state = useOverlayTriggerState({
        isOpen: true,
        onOpenChange: onClose,
      });
      return (
        <Modal state={state} isDismissable={false}>
          {(props, ref) => {
            return (
              <div {...props} ref={ref} autoFocus>
                <div>Hello, world!</div>
                <button onClick={state.close}>Close</button>
              </div>
            );
          }}
        </Modal>
      );
    };

    render(<TestBed2 />);

    await userEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
