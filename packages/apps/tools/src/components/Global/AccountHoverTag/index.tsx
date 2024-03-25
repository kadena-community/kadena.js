import { MonoContentCopy } from '@kadena/react-icons/system';
import React, { useState } from 'react';
import { HoverTag } from '../HoverTag';
import type { IHoverTagProps } from '../HoverTag/HoverTag';

export interface IAccountHoverTagProps extends Pick<IHoverTagProps, 'value'> {}

export const AccountHoverTag = ({ value }: IAccountHoverTagProps) => {
  const [tooltipContent, setTooltipContent] = useState<string>(value);
  return (
    <HoverTag
      icon={<MonoContentCopy />}
      value={value}
      onIconButtonClick={async () => {
        await navigator.clipboard.writeText(value);
        setTooltipContent('Copied!');
        setTimeout(() => {
          setTooltipContent(value);
        }, 1000);
      }}
      tooltipValue={tooltipContent}
      maskOptions={{ character: '.' }}
    />
  );
};
