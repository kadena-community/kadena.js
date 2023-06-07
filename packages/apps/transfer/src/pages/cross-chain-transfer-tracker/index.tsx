import MainLayout from '@/components/Common/Layout/MainLayout';
import { SidebarMenu } from '@/components/Global';
import { StyledMainContent } from '@/pages/cross-chain-transfer-tracker/styles';
import React, { FC, useState } from 'react';

const CrossChainTransferTracker: FC = () => {
  return (
    <MainLayout title="Kadena Coin Transfer">
      <StyledMainContent>
        <SidebarMenu />
        <h3>TO DO: Cross Chain Transfer Tracker</h3>
      </StyledMainContent>
    </MainLayout>
  );
};

export default CrossChainTransferTracker;
