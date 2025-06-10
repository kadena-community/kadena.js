import { useAsset } from '@/hooks/asset';
import { Notification, NotificationHeading } from '@kadena/kode-ui';
import {
  CompactTable,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { FormatSelectAsset } from '../TableFormatters/FormatSelectAsset';

export const AssetsList: FC<{ init?: boolean }> = ({ init }) => {
  const { assets } = useAsset();
  return (
    <SectionCard stack="vertical">
      <SectionCardContentBlock>
        <SectionCardHeader
          title="Assets"
          description={
            <>
              {init
                ? 'You have no asset selected. Which asset do you want to work with?'
                : 'List the organisation contracts'}
            </>
          }
        />
        <SectionCardBody>
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
                width: '70%',
              },
              {
                label: '',
                key: '',
                width: '10%',
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
