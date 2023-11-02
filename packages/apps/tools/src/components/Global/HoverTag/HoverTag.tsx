import type { IMaskedValueProps, MaskOptions } from '@kadena/react-ui';
import { SystemIcon, Tag, Text, Tooltip, maskValue } from '@kadena/react-ui';
import React, { useRef } from 'react';
import { iconButtonClass } from './HoverTag.css';

export interface IHoverTagProps {
  value: IMaskedValueProps['value'];
  icon?: keyof typeof SystemIcon;
  onIconButtonClick?: (param: {
    tagValue: string;
    tooltipValue: string;
  }) => void;
  tooltipValue?: string;
  maskOptions?: Partial<MaskOptions>;
}

export const HoverTag = ({
  value,
  icon,
  onIconButtonClick,
  tooltipValue,
  maskOptions,
}: IHoverTagProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = icon && SystemIcon[icon];
  const tagValue = maskValue(value, maskOptions);
  const tooltipContent = tooltipValue || value;
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
          <Text variant="code">{tagValue}</Text>
          {Icon ? (
            <button
              className={iconButtonClass}
              onClick={() => {
                onIconButtonClick?.({
                  tagValue: tagValue,
                  tooltipValue: tooltipContent,
                });
              }}
              type="button"
            >
              <Icon size="sm" />
            </button>
          ) : null}
        </Tag>
      </span>
      <Tooltip.Root placement="top" ref={ref}>
        <Text variant="code">{tooltipContent}</Text>
      </Tooltip.Root>
    </>
  );
};
