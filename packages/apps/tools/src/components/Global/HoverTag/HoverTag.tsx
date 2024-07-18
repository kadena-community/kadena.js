import type { IMaskedValueProps, MaskOptions } from '@kadena/kode-ui';
import { Tag, Text, Tooltip, maskValue } from '@kadena/kode-ui';
import type { ReactElement } from 'react';
import React from 'react';
import { containerClass, iconButtonClass } from './HoverTag.css';

export interface IHoverTagProps {
  value: IMaskedValueProps['value'];
  icon?: ReactElement;
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
  const tagValue = maskValue(value, maskOptions);
  const tooltipContent = tooltipValue || value;
  return (
    <Tooltip position="top" content={<code>{tooltipContent}</code>}>
      <span data-testid="kda-hover-tag">
        <Tag>
          <div className={containerClass}>
            <Text variant="code">{tagValue}</Text>
            {icon && (
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
                {icon}
              </button>
            )}
          </div>
        </Tag>
      </span>
    </Tooltip>
  );
};
