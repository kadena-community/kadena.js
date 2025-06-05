import { useAsset } from '@/hooks/asset';
import {
  CompactTable,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { FormatSelectAsset } from '../TableFormatters/FormatSelectAsset';

export const AssetsList: FC = () => {
  const { assets } = useAsset();
  return (
    <SectionCard stack="vertical">
      <SectionCardContentBlock>
        <SectionCardHeader
          title="Assets"
          description={<>List the organisation contracts</>}
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
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
