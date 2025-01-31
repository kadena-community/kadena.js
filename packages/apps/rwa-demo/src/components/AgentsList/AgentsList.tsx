import { useEditAgent } from '@/hooks/editAgent';
import { useGetAgents } from '@/hooks/getAgents';
import { useRemoveAgent } from '@/hooks/removeAgent';
import { loadingData } from '@/utils/loadingData';
import { MonoDelete, MonoSupportAgent } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import {
  CompactTable,
  CompactTableFormatters,
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { AgentForm } from '../AgentForm/AgentForm';
import { Confirmation } from '../Confirmation/Confirmation';
import { FormatAgentRoles } from '../TableFormatters/FormatAgentRoles';
import { FormatEditAgent } from '../TableFormatters/FormatEditAgent';
import { TXTYPES } from '../TransactionsProvider/TransactionsProvider';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';

export const AgentsList: FC = () => {
  const { isAllowed: isEditAgentAllowed } = useEditAgent();
  const { data, isLoading } = useGetAgents();
  const { submit, isAllowed: isRemoveAgentAllowed } = useRemoveAgent();

  const handleDelete = async (accountName: any) => {
    await submit({ agent: accountName });
  };

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
                    endVisual={<MonoSupportAgent />}
                    variant="outlined"
                  >
                    Add Agent
                  </Button>
                }
              />
            }
          />
          <SectionCardBody>
            <TransactionTypeSpinner
              type={[TXTYPES.ADDAGENT, TXTYPES.REMOVEAGENT]}
            />
            <CompactTable
              data-testid="agentTable"
              isLoading={isLoading}
              variant="open"
              fields={[
                {
                  label: 'Name',
                  key: 'alias',
                  width: '20%',
                },
                {
                  label: 'Account',
                  key: 'accountName',
                  width: '20%',
                  render: CompactTableFormatters.FormatAccount(),
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
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};
