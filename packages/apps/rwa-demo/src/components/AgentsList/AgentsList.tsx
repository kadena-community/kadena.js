import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useAsset } from '@/hooks/asset';
import { useEditAgent } from '@/hooks/editAgent';
import { useRemoveAgent } from '@/hooks/removeAgent';
import { loadingData } from '@/utils/loadingData';
import { MonoAdd, MonoDelete } from '@kadena/kode-icons';
import {
  Button,
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
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
import type { FC } from 'react';
import { useEffect } from 'react';
import { AgentForm } from '../AgentForm/AgentForm';
import { Confirmation } from '../Confirmation/Confirmation';
import { FormatAccount } from '../TableFormatters/FormatAccount';
import { FormatAgentRoles } from '../TableFormatters/FormatAgentRoles';
import { FormatEditAgent } from '../TableFormatters/FormatEditAgent';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';

export const AgentsList: FC = () => {
  const {
    agents: data,
    agentsIsLoading: isLoading,
    initFetchAgents,
  } = useAsset();
  const { isAllowed: isEditAgentAllowed } = useEditAgent();
  const { submit, isAllowed: isRemoveAgentAllowed } = useRemoveAgent();

  const handleDelete = async (accountName: any) => {
    await submit({ agent: accountName });
  };

  useEffect(() => {
    initFetchAgents();
  }, []);

  return (
    <>
      <SectionCard stack="vertical" data-testid="agentsCard">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Agents"
            description={<>All the agents for this contract</>}
            actions={
              <AgentForm
                trigger={
                  <Button
                    isDisabled={!isEditAgentAllowed}
                    isCompact
                    endVisual={<MonoAdd />}
                    variant="outlined"
                  >
                    Add Agent
                  </Button>
                }
              />
            }
          />
          <SectionCardBody>
            <Stack data-testid="agentTableTxSpinner">
              <TransactionTypeSpinner
                type={[TXTYPES.ADDAGENT, TXTYPES.REMOVEAGENT]}
              />
            </Stack>
            <CompactTable
              data-testid="agentTable"
              isLoading={isLoading}
              variant="open"
              fields={[
                {
                  label: 'Account',
                  key: 'accountName',
                  width: '40%',
                  render: FormatAccount(),
                },
                {
                  label: 'Roles',
                  key: 'accountName',
                  width: '40%',
                  render: FormatAgentRoles(),
                },
                {
                  label: '',
                  key: '',
                  width: '8%',
                  render: FormatEditAgent(),
                },
                {
                  label: '',
                  key: 'accountName',
                  width: '7%',
                  render: CompactTableFormatters.FormatActions({
                    trigger: (
                      <Confirmation
                        onPress={handleDelete}
                        trigger={
                          <Button
                            isDisabled={!isRemoveAgentAllowed}
                            isCompact
                            variant="outlined"
                            startVisual={<MonoDelete />}
                          />
                        }
                      >
                        Are you sure you want to delete this agent?
                      </Confirmation>
                    ),
                  }),
                },
              ]}
              data={isLoading ? loadingData : data}
            />

            {!isLoading && data?.length === 0 && (
              <Notification role="alert">
                <NotificationHeading>No agents found yet</NotificationHeading>
                This asset has no agents yet.
                <NotificationFooter>
                  <AgentForm
                    trigger={
                      <NotificationButton
                        isDisabled={!isEditAgentAllowed}
                        icon={<MonoAdd />}
                      >
                        Add Agent
                      </NotificationButton>
                    }
                  />
                </NotificationFooter>
              </Notification>
            )}
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};
