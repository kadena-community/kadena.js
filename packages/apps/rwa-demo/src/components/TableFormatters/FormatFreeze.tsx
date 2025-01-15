import { Button } from '@kadena/kode-ui';
import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import React from 'react';
import { FreezeInvestor } from '../FreezeInvestor/FreezeInvestor';

export interface IActionProps {}

export const FormatFreeze = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    return (
      <FreezeInvestor
        isCompact={true}
        variant="outlined"
        iconOnly={true}
        investorAccount={value as string}
        trigger={<Button />}
      />
    );
  };
  return Component;
};
