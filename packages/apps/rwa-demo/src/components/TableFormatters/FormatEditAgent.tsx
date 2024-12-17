import { useEditAgent } from '@/hooks/editAgent';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { MonoEditNote } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import React from 'react';
import { AgentForm } from '../AgentForm/AgentForm';

export interface IActionProps {}

export const FormatEditAgent = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const { isAllowed: isEditAgentAllowed } = useEditAgent();
    return (
      <AgentForm
        agent={value as unknown as IRecord}
        trigger={
          <Button
            isDisabled={!isEditAgentAllowed}
            isCompact
            endVisual={<MonoEditNote />}
            variant="outlined"
          />
        }
      />
    );
  };
  return Component;
};
