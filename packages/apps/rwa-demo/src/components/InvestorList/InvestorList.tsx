import { useAddInvestor } from '@/hooks/addInvestor';
import { useDeleteInvestor } from '@/hooks/deleteInvestor';
import { useGetInvestors } from '@/hooks/getInvestors';
import { loadingData } from '@/utils/loadingData';
import { MonoAdd, MonoDelete, MonoFindInPage } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { InvestorForm } from '../InvestorForm/InvestorForm';
import { FormatFreeze } from '../TableFormatters/FormatFreeze';
import { FormatInvestorBalance } from '../TableFormatters/FormatInvestorBalance';

export const InvestorList: FC = () => {
  const { data, isLoading } = useGetInvestors();
  const router = useRouter();
  const { submit, isAllowed: isDeleteInvestorAllowed } = useDeleteInvestor();
  const { isAllowed: isAddInvestorAllowed } = useAddInvestor({});

  const handleDelete = async (accountName: any) => {
    return await submit({ investor: accountName });
  };
  const handleLink = async (accountName: any) => {
    router.push(`/investors/${accountName}`);
  };

  return (
    <>
      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Investors"
            actions={
              <InvestorForm
                trigger={
                  <Button
                    isCompact
                    variant="outlined"
                    isDisabled={!isAddInvestorAllowed}
                    endVisual={<MonoAdd />}
                  >
                    Add Investor
                  </Button>
                }
              />
            }
          />
          <SectionCardBody>
            <CompactTable
              isLoading={isLoading}
              variant="open"
              fields={[
                {
                  label: 'Name',
                  key: 'alias',
                  width: '30%',
                },
                {
                  label: 'Account',
                  key: 'accountName',
                  width: '35%',
                  render: CompactTableFormatters.FormatAccount(),
                },
                {
                  label: 'Balance',
                  key: 'accountName',
                  width: '20%',
                  render: FormatInvestorBalance(),
                },
                {
                  label: '',
                  key: 'accountName',
                  width: '5%',
                  render: FormatFreeze(),
                },
                {
                  label: '',
                  key: 'accountName',
                  width: '5%',
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
                  width: '5%',
                  render: CompactTableFormatters.FormatActions({
                    trigger: (
                      <Button
                        isCompact
                        isDisabled={!isDeleteInvestorAllowed}
                        variant="outlined"
                        startVisual={<MonoDelete />}
                        onPress={handleDelete}
                      />
                    ),
                  }),
                },
              ]}
              data={isLoading ? loadingData : data}
            />
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};
