import { containerClass } from '@components/Card/Card.css';
import { SystemIcon } from '@components/Icon';
import { Heading } from '@components/Typography';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import type { AriaDialogProps } from 'react-aria';
import { useDialog } from 'react-aria';
import { closeButtonClass, overlayClass, titleWrapperClass } from './Modal.css';

interface IDialogProps extends AriaDialogProps {
  title?: string;
  children: ReactNode;
  onClose: () => void;
}

export const Dialog: FC<IDialogProps> = ({
  title,
  children,
  onClose,
  ...props
}) => {
  const ref = React.useRef(null);
  const { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <div
      {...dialogProps}
      ref={ref}
      className={classNames(containerClass, overlayClass)}
    >
      {onClose && (
        <button
          className={closeButtonClass}
          onClick={onClose}
          title="Close modal"
        >
          <SystemIcon.Close />
        </button>
      )}

      {title && (
        <div className={titleWrapperClass}>
          <Heading as="h3" {...titleProps}>
            {title}
          </Heading>
        </div>
      )}
      {children}
    </div>
  );
};
