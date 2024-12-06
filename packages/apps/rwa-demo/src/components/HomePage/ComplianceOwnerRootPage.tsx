'use client';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { MonoAdd } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import { SetComplianceForm } from '../SetComplianceForm/SetComplianceForm';

export const ComplianceOwnerRootPage = () => {
  const { isComplianceOwner } = useAccount();
  const { paused } = useAsset();

  return (
    <Stack width="100%" flexDirection="column" gap="md">
      <SideBarBreadcrumbs />

      <Stack gap="sm">
        {isComplianceOwner && (
          <>
            <SetComplianceForm
              trigger={
                <Button isDisabled={paused} startVisual={<MonoAdd />}>
                  Set Compliance
                </Button>
              }
            />
          </>
        )}
      </Stack>
    </Stack>
  );
};
