import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useOrganisation } from '@/hooks/organisation';
import { useUser } from '@/hooks/user';
import { Button } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useState } from 'react';
import { AssetMetaData } from './AssetMetaData';

export const AssetMetaDataCard: FC = () => {
  const { asset, createAssetMetaLayout } = useAsset();
  const { userToken } = useUser();
  const { isOwner } = useAccount();
  const { organisation } = useOrganisation();
  const [isLoading, setIsLoading] = useState(false);

  console.log('AssetMetaDataCard asset:', asset);

  const createLayout = async () => {
    if (!asset || !userToken || !organisation) return;

    setIsLoading(true);
    try {
      await createAssetMetaLayout(asset, userToken);
    } catch (e: any) {
      console.error('Error:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!asset?.dataLayoutjson) return null;
  return (
    <SectionCard data-testid="metaDataCard">
      <SectionCardContentBlock>
        <SectionCardHeader
          title="Meta data"
          description={<>Specific asset data</>}
          actions={
            <>
              {isOwner && (
                <Button
                  isCompact
                  variant="outlined"
                  onClick={createLayout}
                  isDisabled={isLoading}
                  isLoading={isLoading}
                >
                  Redo layout
                </Button>
              )}
            </>
          }
        />
        <SectionCardBody>
          <AssetMetaData
            data={asset?.datajson}
            layout={asset?.dataLayoutjson}
          />
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
