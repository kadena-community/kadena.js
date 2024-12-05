'use client';
import { SetMaxBalanceForm } from '@/components/SetMaxBalanceForm/SetMaxBalanceForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { MonoAdd } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { SetMaxSupplyForm } from '../SetMaxSupplyForm/SetMaxSupplyForm';

export const ComplianceOwnerRootPage = () => {
  const { isComplianceOwner } = useAccount();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const { paused } = useAsset();
  const [hasOpenMaxBalanceForm, setHasOpenMaxBalanceForm] = useState(false);
  const [hasOpenMaxSupplyForm, setHasOpenMaxSupplyForm] = useState(false);

  const handleMaxBalanceForm = () => {
    setIsRightAsideExpanded(true);
    setHasOpenMaxBalanceForm(true);
  };
  const handleMaxSupplyForm = () => {
    setIsRightAsideExpanded(true);
    setHasOpenMaxSupplyForm(true);
  };

  return (
    <Stack width="100%" flexDirection="column" gap="md">
      <SideBarBreadcrumbs />

      {isRightAsideExpanded && hasOpenMaxBalanceForm && (
        <SetMaxBalanceForm
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenMaxBalanceForm(false);
          }}
        />
      )}
      {isRightAsideExpanded && hasOpenMaxSupplyForm && (
        <SetMaxSupplyForm
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenMaxSupplyForm(false);
          }}
        />
      )}

      <Stack gap="sm">
        {isComplianceOwner && (
          <>
            <Button
              isDisabled={paused}
              startVisual={<MonoAdd />}
              onClick={handleMaxBalanceForm}
            >
              Set Max Balance
            </Button>
            <Button
              isDisabled={paused}
              startVisual={<MonoAdd />}
              onClick={handleMaxSupplyForm}
            >
              Set Max Supply
            </Button>
          </>
        )}
      </Stack>
    </Stack>
  );
};
