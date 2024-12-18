import { useDeleteInvestor } from '@/hooks/deleteInvestor';
import { MonoDelete } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import React from 'react';
import { Confirmation } from '../Confirmation/Confirmation';

export interface IActionProps {}

export const FormatDeleteInvestor = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const investorAccount = value as string;
    const {
      submit,
      isAllowed: isDeleteInvestorAllowed,
      notAllowedReason,
    } = useDeleteInvestor({
      investorAccount,
    });

    const handleDelete = async () => {
      return await submit({ investor: investorAccount });
    };
    return (
      <Confirmation
        onPress={handleDelete}
        trigger={
          <Button
            isDisabled={!isDeleteInvestorAllowed}
            title={notAllowedReason}
            isCompact
            variant="outlined"
            startVisual={<MonoDelete />}
          />
        }
      >
        Are you sure you want to delete this agent?
      </Confirmation>
    );
  };
  return Component;
};
