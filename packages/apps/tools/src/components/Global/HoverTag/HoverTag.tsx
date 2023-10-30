import type { IMaskedValueProps } from '@kadena/react-ui';
import { SystemIcon, Tooltip, maskValue } from '@kadena/react-ui';
import React, { useRef } from 'react';
import {
  closeButtonClass,
  tagClass,
  tagStyles,
  tooltipStyles,
} from './HoverTag.css';

export interface IHoverTagProps {
  value: IMaskedValueProps['value'];
}

export const HoverTag = ({ value }: IHoverTagProps) => {
  const [tooltipContent, setTooltipContent] = React.useState<string>(value);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <span
        data-testid="kda-hover-tag"
        className={tagClass}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) =>
          Tooltip.handler(e, ref)
        }
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
          Tooltip.handler(e, ref)
        }
      >
        <span className={tagStyles}>{maskValue(value)}</span>
        <button
          className={closeButtonClass}
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setTooltipContent('Copied!');
            setTimeout(() => {
              setTooltipContent(value);
            }, 1000);
          }}
        >
          <SystemIcon.ContentCopy size="sm" />
        </button>
      </span>
      <Tooltip.Root placement="top" ref={ref}>
        <span className={tooltipStyles}>{tooltipContent}</span>
      </Tooltip.Root>
    </>
  );
};
