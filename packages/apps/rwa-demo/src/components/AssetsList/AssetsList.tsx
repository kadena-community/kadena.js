import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { MonoFindInPage } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  useNotifications,
} from '@kadena/kode-ui/patterns';
import { FC } from 'react';

export const AssetsList: FC = () => {
  const { assets, getAsset, setAsset } = useAsset();
  const { account } = useAccount();
  const { addNotification } = useNotifications();

  const handleLink = async (assetProp: any) => {
    const asset = await getAsset(assetProp.uuid, account!);
    if (!asset) {
      addNotification({
        intent: 'negative',
        label: 'asset is not found',
      });
      return;
    }
    setAsset(asset);
    window.location.href = '/';
  };

  return (
    <SectionCard stack="vertical">
      <SectionCardContentBlock>
        <SectionCardHeader
          title="Assets"
          description={<>List the organisation contracts</>}
        />
        <SectionCardBody>
          <CompactTable
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
                render: CompactTableFormatters.FormatActions({
                  trigger: (
                    <Button
                      isCompact
                      variant="outlined"
                      startVisual={<MonoFindInPage />}
                      onPress={handleLink}
                    />
                  ),
                }),
              },
            ]}
            data={assets}
          />
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
