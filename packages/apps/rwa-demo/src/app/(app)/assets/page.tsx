'use client';

import { AssetForm } from '@/components/AssetForm/AssetForm';
import { Confirmation } from '@/components/Confirmation/Confirmation';
import { useAsset } from '@/hooks/asset';
import { MonoAdd, MonoDelete } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  RightAside,
  RightAsideContent,
  RightAsideHeader,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { useState } from 'react';

const Assets = () => {
  const { assets, removeAsset } = useAsset();
  const [openSide, setOpenSide] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();

  const handleDelete = (value: any) => {
    removeAsset(value);
  };

  return (
    <>
      {isRightAsideExpanded && openSide && (
        <RightAside
          isOpen
          onClose={() => {
            setIsRightAsideExpanded(false);
            setOpenSide(false);
          }}
        >
          <RightAsideHeader label="Assets" />
          <RightAsideContent></RightAsideContent>
        </RightAside>
      )}
      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Assets"
            description={<>List of all your selected contracts</>}
            actions={
              <AssetForm
                trigger={
                  <Button variant="outlined" isCompact endVisual={<MonoAdd />}>
                    Add Asset
                  </Button>
                }
              />
            }
          />
          <SectionCardBody>
            <CompactTable
              fields={[
                {
                  key: 'contractName',
                  label: 'name',
                  width: '90%',
                  render: CompactTableFormatters.FormatLink({
                    linkComponent: Link,
                    url: '/assets/:value',
                  }),
                },
                {
                  label: '',
                  key: 'uuid',
                  width: '10%',
                  render: CompactTableFormatters.FormatActions({
                    trigger: (
                      <Confirmation
                        onPress={handleDelete}
                        trigger={
                          <Button
                            isCompact
                            variant="outlined"
                            startVisual={<MonoDelete />}
                          />
                        }
                      >
                        Are you sure you want to remove this asset?
                      </Confirmation>
                    ),
                  }),
                },
              ]}
              data={assets}
            />
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};

export default Assets;
