import type { IMaskedValueProps } from '@kadena/react-ui';
import { SystemIcon, Tag, Text, Tooltip, maskValue } from '@kadena/react-ui';
import React, { useRef } from 'react';
import { copyButtonClass } from './HoverTag.css';

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
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) =>
          Tooltip.handler(e, ref)
        }
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
          Tooltip.handler(e, ref)
        }
      >
        <Tag>
          <Text variant="code">{maskValue(value)}</Text>
          <button
            className={copyButtonClass}
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
        </Tag>
      </span>
      <Tooltip.Root placement="top" ref={ref}>
        <Text variant="code">{tooltipContent}</Text>
      </Tooltip.Root>
    </>
  );
};
