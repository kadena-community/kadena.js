import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useGetAgents } from '@/hooks/getAgents';
import { useTransactions } from '@/hooks/transactions';
import { removeAgent } from '@/services/removeAgent';
import { getClient } from '@/utils/client';
import { MonoDelete, MonoSupportAgent } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  useLayout,
  useNotifications,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useState } from 'react';
import { AddAgentForm } from '../AddAgentForm/AddAgentForm';
import { Confirmation } from '../Confirmation/Confirmation';
import { interpretErrorMessage } from '../TransactionsProvider/TransactionsProvider';

export const AgentsList: FC = () => {
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const { paused } = useAsset();
  const { data } = useGetAgents();
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();
  const [hasOpenAgentForm, setHasOpenAgentForm] = useState(false);

  const handleAddAgent = () => {
    setIsRightAsideExpanded(true);
    setHasOpenAgentForm(true);
  };

  const handleDelete = async (accountName: any) => {
    try {
      const tx = await removeAgent({ agent: accountName }, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      await addTransaction({
        ...res,
        type: 'REMOVEAGENT',
      });

      await client.listen(res);
      console.log('DONE');
    } catch (e: any) {
      addNotification({
        intent: 'negative',
        label: 'there was an error',
        message: interpretErrorMessage(e.message),
      });
    }
  };

  return (
    <>
      {isRightAsideExpanded && hasOpenAgentForm && (
        <AddAgentForm
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenAgentForm(false);
          }}
        />
      )}
      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Agents"
            description={<>All the agents for this contract</>}
            actions={
              <Button
                isDisabled={paused}
                endVisual={<MonoSupportAgent />}
                onClick={handleAddAgent}
                variant="outlined"
              >
                Add Agent
              </Button>
            }
          />
          <SectionCardBody>
            <CompactTable
              fields={[
                {
                  label: 'status',
                  key: 'result',
                  width: '10%',
                  render: CompactTableFormatters.FormatStatus(),
                },
                { label: 'Account', key: 'accountName', width: '50%' },
                { label: 'Requestkey', key: 'requestKey', width: '30%' },
                {
                  label: '',
                  key: 'accountName',
                  width: '10%',
                  render: CompactTableFormatters.FormatActions({
                    trigger: (
                      <Confirmation
                        onPress={handleDelete}
                        trigger={<Button startVisual={<MonoDelete />} />}
                      >
                        Are you sure you want to delete this agent?
                      </Confirmation>
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
