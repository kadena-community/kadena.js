import type { IMaskedValueProps, MaskOptions } from '@kadena/react-ui';
import { SystemIcon, Tag, Text, Tooltip, maskValue } from '@kadena/react-ui';
import React from 'react';
import { containerClass, iconButtonClass } from './HoverTag.css';

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
  const Icon = icon && SystemIcon[icon];
  const tagValue = maskValue(value, maskOptions);
  const tooltipContent = tooltipValue || value;
  return (
    <Tooltip position="top" content={<code>{tooltipContent}</code>}>
      <span data-testid="kda-hover-tag">
        <Tag>
          <div className={containerClass}>
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
          </div>
        </Tag>
      </span>
    </Tooltip>
  );
};
