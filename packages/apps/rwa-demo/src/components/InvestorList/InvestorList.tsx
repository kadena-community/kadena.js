import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useAccount } from '@/hooks/account';
import { useAddInvestor } from '@/hooks/addInvestor';
import { useAsset } from '@/hooks/asset';
import { loadingData } from '@/utils/loadingData';
import {
  MonoAdd,
  MonoFindInPage,
  MonoMoreVert,
  MonoPause,
  MonoPlayArrow,
} from '@kadena/kode-icons';
import {
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuItem,
  Stack,
} from '@kadena/kode-ui';
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
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BadgeFreezeForm } from '../BadgeFreezeForm/BadgeFreezeForm';
import { InvestorBatchForm } from '../InvestorBatchForm/InvestorBatchForm';
import { InvestorForm } from '../InvestorForm/InvestorForm';
import { FormatAccount } from '../TableFormatters/FormatAccount';
import { FormatCheckbox } from '../TableFormatters/FormatCheckbox';
import { FormatDeleteInvestor } from '../TableFormatters/FormatDeleteInvestor';
import { FormatFreeze } from '../TableFormatters/FormatFreeze';
import { FormatInvestorBalance } from '../TableFormatters/FormatInvestorBalance';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';

export const InvestorList: FC = () => {
  const [batchFreezeType, setBatchFreezeType] = useState<
    'freeze' | 'unfreeze'
  >();
  const formRef = useRef<HTMLFormElement>(null);
  const {
    investors: data,
    initFetchInvestors,
    investorsIsLoading: isLoading,
  } = useAsset();
  const [isOpenBatchAddInvestors, setIsOpenBatchAddInvestors] = useState(false);
  const router = useRouter();
  const { account } = useAccount();
  const { isAllowed: isAddInvestorAllowed } = useAddInvestor({});

  const {
    reset,
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<{
    select: [];
  }>({
    defaultValues: {
      select: [],
    },
  });

  const handleLink = async (accountName: any) => {
    router.push(`/investors/${accountName}`);
  };

  useEffect(() => {
    initFetchInvestors();
  }, []);

  return (
    <>
      <form ref={formRef}>
        <BadgeFreezeForm
          type={batchFreezeType}
          handleSubmit={handleSubmit}
          handleReset={() => {
            reset({ select: [] });
            setBatchFreezeType(undefined);
          }}
          isDisabled={!isDirty}
        />

        {isOpenBatchAddInvestors && (
          <InvestorBatchForm
            onClose={() => {
              setIsOpenBatchAddInvestors(false);
            }}
          />
        )}
        <SectionCard stack="vertical" data-testid="investorsCard">
          <SectionCardContentBlock>
            <SectionCardHeader
              title="Investors"
              actions={
                <>
                  <ButtonGroup>
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
                    <ContextMenu
                      trigger={
                        <Button
                          isCompact
                          variant="outlined"
                          startVisual={<MonoMoreVert />}
                        />
                      }
                    >
                      <ContextMenuItem
                        label="Batch add investors"
                        isDisabled={!isAddInvestorAllowed}
                        endVisual={<MonoAdd />}
                        onClick={() => {
                          setIsOpenBatchAddInvestors(true);
                        }}
                      />

                      <ContextMenuItem
                        label="Freeze"
                        onClick={() => setBatchFreezeType('freeze')}
                        endVisual={
                          <TransactionTypeSpinner
                            type={[TXTYPES.FREEZEINVESTOR]}
                            account={account?.address}
                            fallbackIcon={<MonoPlayArrow />}
                          />
                        }
                      />
                      <ContextMenuItem
                        label="Unfreeze"
                        onClick={() => setBatchFreezeType('unfreeze')}
                        endVisual={
                          <TransactionTypeSpinner
                            type={[TXTYPES.FREEZEINVESTOR]}
                            account={account?.address}
                            fallbackIcon={<MonoPause />}
                          />
                        }
                      />
                    </ContextMenu>
                  </ButtonGroup>
                </>
              }
            />

            <SectionCardBody>
              <Stack data-testid="investorTableTxSpinner">
                <TransactionTypeSpinner
                  type={[TXTYPES.ADDINVESTOR, TXTYPES.DELETEINVESTOR]}
                />
              </Stack>

              <CompactTable
                data-testid="investorTable"
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
                    key: 'accountName',
                    width: '20%',
                    render: FormatAccount(),
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
                          data-testid="select-account"
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
