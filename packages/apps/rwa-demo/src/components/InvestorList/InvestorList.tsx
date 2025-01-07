import { useAddInvestor } from '@/hooks/addInvestor';
import { useGetInvestors } from '@/hooks/getInvestors';
import { loadingData } from '@/utils/loadingData';
import { MonoAdd, MonoFindInPage } from '@kadena/kode-icons';
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
import { InvestorBatchForm } from '../InvestorBatchForm/InvestorBatchForm';
import { InvestorForm } from '../InvestorForm/InvestorForm';
import { FormatDeleteInvestor } from '../TableFormatters/FormatDeleteInvestor';
import { FormatFreeze } from '../TableFormatters/FormatFreeze';
import { FormatInvestorBalance } from '../TableFormatters/FormatInvestorBalance';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { TXTYPES } from '../TransactionsProvider/TransactionsProvider';

export const InvestorList: FC = () => {
  const { data, isLoading } = useGetInvestors();
  const router = useRouter();
  const { isAllowed: isAddInvestorAllowed } = useAddInvestor({});

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
              <>
                <InvestorBatchForm
                  trigger={
                    <Button
                      isCompact
                      variant="outlined"
                      isDisabled={!isAddInvestorAllowed}
                      endVisual={<MonoAdd />}
                    >
                      Batch add investors
                    </Button>
                  }
                />
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
              </>
            }
          />
          <SectionCardBody>
            <TransactionTypeSpinner
              type={[TXTYPES.ADDINVESTOR, TXTYPES.DELETEINVESTOR]}
            />
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
                  render: FormatDeleteInvestor(),
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
