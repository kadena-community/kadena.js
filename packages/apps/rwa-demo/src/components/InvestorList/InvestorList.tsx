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
} from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { InvestorForm } from '../InvestorForm/InvestorForm';
import { FormatFreeze } from '../TableFormatters/FormatFreeze';

export const InvestorList: FC = () => {
  const { data } = useGetInvestors();
  const router = useRouter();
  const { submit } = useDeleteInvestor();
  const { paused } = useAsset();

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
                    isDisabled={paused}
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
