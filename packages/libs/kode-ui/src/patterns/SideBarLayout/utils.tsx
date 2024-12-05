import React, { forwardRef } from 'react';
import type { IButtonProps, ILinkProps } from 'src/components';

export const Anchor = forwardRef<HTMLAnchorElement, ILinkProps>(
  ({ children, ...props }, ref) => (
    <a {...props} ref={ref}>
      {children}
    </a>
  ),
);
Anchor.displayName = 'Anchor';

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, ...props }, ref) => (
    <button {...props} ref={ref}>
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
