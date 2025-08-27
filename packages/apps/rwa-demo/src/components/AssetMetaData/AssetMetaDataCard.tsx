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
import { useEffect, useState } from 'react';
import { AssetMetaData } from './AssetMetaData';

export const AssetMetaDataCard: FC = () => {
  const { asset } = useAsset();
  const { userToken } = useUser();
  const { organisation } = useOrganisation();
  const [isLoading, setIsLoading] = useState(false);
  const [layout, setLayout] = useState<any>(null);

  const createLayout = async (data: any) => {
    if (!userToken || !organisation) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/contract/metadata?organisationId=${organisation.id}`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            Authorization: `Bearer ${userToken?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      const result = await res.json();
      setLayout(result);
    } catch (e: any) {
      console.error('Error:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userToken || !asset?.datajson) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createLayout(asset?.datajson);
  }, [userToken?.token, organisation?.id, asset?.datajson]);

  if (!asset?.datajson) return null;

  return (
    <SectionCard data-testid="metaDataCard">
      <SectionCardContentBlock>
        <SectionCardHeader
          title="Meta data"
          description={<>Specific asset data</>}
          actions={
            <>
              <Button
                isCompact
                variant="outlined"
                onClick={() => createLayout(asset?.datajson)}
                isDisabled={isLoading}
                isLoading={isLoading}
              >
                Redo layout
              </Button>
            </>
          }
        />
        <SectionCardBody>
          <AssetMetaData data={asset?.datajson} layout={layout} />
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
