import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import React from 'react';
import { InvestorBalance } from '../InvestorBalance/InvestorBalance';

export interface IActionProps {}

export const FormatInvestorBalance = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    return <InvestorBalance investorAccount={value as string} short />;
  };
  return Component;
};
