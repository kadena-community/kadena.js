import { useAsset } from '@/hooks/asset';
import { useCreateContract } from '@/hooks/createContract';
import { MonoAdd } from '@kadena/kode-icons';
import { Button, Notification, NotificationHeading } from '@kadena/kode-ui';
import {
  CompactTable,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { AssetFormScreen } from '../AssetForm/AssetFormScreen';
import { FormatSelectAsset } from '../TableFormatters/FormatSelectAsset';

export const AssetsList: FC<{ init?: boolean }> = ({ init }) => {
  const { assets, asset } = useAsset();
  const { isAllowed } = useCreateContract();

  return (
    <SectionCard stack="vertical">
      <SectionCardContentBlock>
        <SectionCardHeader
          title="Assets"
          description={
            <>
              {!asset?.contractName
                ? 'You have no asset selected. Which asset do you want to work with?'
                : 'List the organisation contracts'}
            </>
          }
          actions={
            <AssetFormScreen
              trigger={
                <Button
                  aria-label="Add asset"
                  isDisabled={!isAllowed}
                  variant="outlined"
                  isCompact
                  endVisual={<MonoAdd />}
                >
                  Add Asset
                </Button>
              }
            />
          }
        />
        <SectionCardBody>
          {isAllowed.toString()}
          <CompactTable
            variant="open"
            fields={[
              {
                key: 'contractName',
                label: 'name',
                width: '20%',
              },
              {
                key: 'namespace',
                label: 'ns',
                width: '50%',
              },
              {
                label: '',
                key: '',
                width: '15%',
                align: 'end',
                render: FormatSelectAsset(),
              },
            ]}
            data={assets}
          />

          {assets?.length === 0 && (
            <Notification role="alert">
              <NotificationHeading>No assets found yet</NotificationHeading>
              This organisation has no assets yet. The admins of this
              organisation can add assets.
            </Notification>
          )}
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
