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
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { BadgeFreezeForm } from '../BadgeFreezeForm/BadgeFreezeForm';
import { InvestorBatchForm } from '../InvestorBatchForm/InvestorBatchForm';
import { InvestorForm } from '../InvestorForm/InvestorForm';
import { FormatCheckbox } from '../TableFormatters/FormatCheckbox';
import { FormatDeleteInvestor } from '../TableFormatters/FormatDeleteInvestor';
import { FormatFreeze } from '../TableFormatters/FormatFreeze';
import { FormatInvestorBalance } from '../TableFormatters/FormatInvestorBalance';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { TXTYPES } from '../TransactionsProvider/TransactionsProvider';

export const InvestorList: FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { data, isLoading } = useGetInvestors();
  const router = useRouter();
  const { isAllowed: isAddInvestorAllowed } = useAddInvestor({});

  const {
    reset,
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<{
    select: [];
    message: '';
  }>({
    defaultValues: {
      select: [],
      message: '',
    },
  });

  const handleLink = async (accountName: any) => {
    router.push(`/investors/${accountName}`);
  };

  return (
    <>
      <form ref={formRef}>
        <SectionCard stack="vertical">
          <SectionCardContentBlock>
            <SectionCardHeader
              title="Investors"
              actions={
                <>
                  <BadgeFreezeForm
                    pause={true}
                    handleSubmit={handleSubmit}
                    handleReset={reset}
                    isDisabled={!isDirty}
                  />
                  <BadgeFreezeForm
                    pause={false}
                    handleSubmit={handleSubmit}
                    handleReset={reset}
                    isDisabled={!isDirty}
                  />

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
                    key: 'accountName',
                    label: '',
                    width: '10%',
                    render: FormatCheckbox({
                      register,
                      name: 'select',
                    }),
                  },
                  {
                    label: 'Name',
                    key: 'alias',
                    width: '20%',
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
      </form>
    </>
  );
};
