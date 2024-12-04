import { useAsset } from '@/hooks/asset';
import { useDeleteInvestor } from '@/hooks/deleteInvestor';
import { useGetInvestors } from '@/hooks/getInvestors';
import { MonoAdd, MonoDelete, MonoFindInPage } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useState } from 'react';
import { AddInvestorForm } from '../AddInvestorForm/AddInvestorForm';
import { FormatFreeze } from '../TableFormatters/FormatFreeze';

export const InvestorList: FC = () => {
  const { data } = useGetInvestors();
  const router = useRouter();
  const { submit } = useDeleteInvestor();
  const { paused } = useAsset();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const [hasOpenInvestorForm, setHasOpenInvestorForm] = useState(false);

  const handleDelete = async (accountName: any) => {
    return await submit({ investor: accountName });
  };
  const handleLink = async (accountName: any) => {
    router.push(`/investors/${accountName}`);
  };

  const handleAddInvestor = () => {
    setIsRightAsideExpanded(true);
    setHasOpenInvestorForm(true);
  };

  return (
    <>
      {isRightAsideExpanded && hasOpenInvestorForm && (
        <AddInvestorForm
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenInvestorForm(false);
          }}
        />
      )}

      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Investors"
            actions={
              <Button
                isCompact
                variant="outlined"
                isDisabled={paused}
                endVisual={<MonoAdd />}
                onPress={handleAddInvestor}
              >
                Add Investor
              </Button>
            }
          />

          <SectionCardBody>
            <CompactTable
              fields={[
                {
                  label: 'Status',
                  key: 'result',
                  width: '10%',
                  render: CompactTableFormatters.FormatStatus(),
                },
                {
                  label: 'Account',
                  key: 'accountName',
                  width: '65%',
                  render: CompactTableFormatters.FormatAccount(),
                },
                {
                  label: '',
                  key: 'accountName',
                  width: '10%',
                  render: FormatFreeze(),
                },
                {
                  label: '',
                  key: 'accountName',
                  width: '8%',
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
                {
                  label: '',
                  key: 'accountName',
                  width: '7%',
                  render: CompactTableFormatters.FormatActions({
                    trigger: (
                      <Button
                        isCompact
                        variant="outlined"
                        startVisual={<MonoDelete />}
                        onPress={handleDelete}
                      />
                    ),
                  }),
                },
              ]}
              data={data}
            />
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};
