import { Box } from '@kadena/react-ui';
import cn from 'classnames';
import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import type { ButtonProps } from 'react-aria-components';
import { Button as AriaButton } from 'react-aria-components';
import type { Variants } from './SharedButton.css';
import { button, progressIndicator } from './SharedButton.css';

interface Props extends ButtonProps, Variants {
  progress?: number;
}

const BaseButton = (props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
  const { children, className, variant, progress = 0, ...restProps } = props;

  return (
    <AriaButton
      ref={ref}
      className={cn(button({ variant }), `${className}`)}
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
