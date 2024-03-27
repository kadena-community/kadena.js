import { Box } from '@kadena/react-ui';
import cn from 'classnames';
import type { ForwardedRef, MouseEventHandler } from 'react';
import { forwardRef } from 'react';
import type { ButtonProps } from 'react-aria-components';
import { Button as AriaButton } from 'react-aria-components';
import type { Variants } from './SharedButton.css';
import { button, progressIndicator } from './SharedButton.css';
import { buttonClass, secondaryClass, tertiaryClass } from './style.css';

interface Props extends ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  progress?: number;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'progress';
}

const BaseButton = (props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
  const { children, variant, progress = 0, ...restProps } = props;

  return (
    <AriaButton
      ref={ref}
      className={cn(
        button({ variant: variant as Variants['variant'] }),
        buttonClass,
        variant === 'secondary' && secondaryClass,
        variant === 'tertiary' && tertiaryClass,
      )}
      {...restProps}
    >
      <>
        {variant === 'progress' && (
          <Box
            aria-hidden
            as="span"
            className={progressIndicator}
            style={{ left: `${progress}%` }}
          />
        )}
        {children}
      </>
    </AriaButton>
  );
};

export const Button = forwardRef(BaseButton);
