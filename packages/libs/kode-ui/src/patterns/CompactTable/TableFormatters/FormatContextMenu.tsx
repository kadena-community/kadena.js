import { MonoMoreVert } from '@kadena/kode-icons/system';
import React from 'react';
import { Button, ContextMenu, ContextMenuItem } from './../../../components';
import type { ICompactTableFormatterProps } from './types';

type IActionProps = {
  label: string;
  trigger: (value: unknown) => unknown;
}[];

export const FormatContextMenu = (props: IActionProps) => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    return (
      <ContextMenu
        placement="bottom end"
        trigger={
          <Button
            endVisual={<MonoMoreVert />}
            variant="transparent"
            isCompact
          />
        }
      >
        {props.map((prop) => {
          return (
            <ContextMenuItem
              key={value.toString()}
              label={prop.label}
              onClick={async () => {
                return await prop.trigger(value);
              }}
            />
          );
        })}
      </ContextMenu>
    );
  };
  return Component;
};
