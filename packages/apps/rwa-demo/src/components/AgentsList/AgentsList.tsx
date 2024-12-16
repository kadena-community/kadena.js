import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useGetAgents } from '@/hooks/getAgents';
import { useRemoveAgent } from '@/hooks/removeAgent';
import { loadingData } from '@/utils/loadingData';
import {
  MonoDelete,
  MonoFindInPage,
  MonoSupportAgent,
} from '@kadena/kode-icons';
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
import { AgentForm } from '../AgentForm/AgentForm';
import { Confirmation } from '../Confirmation/Confirmation';
import { FormatAgentRoles } from '../TableFormatters/FormatAgentRoles';

export const AgentsList: FC = () => {
  const { paused } = useAsset();
  const { accountRoles, isOwner } = useAccount();
  const { data, isLoading } = useGetAgents();
  const { submit } = useRemoveAgent();
  const router = useRouter();

  const handleDelete = async (accountName: any) => {
    await submit({ agent: accountName });
  };

  const handleLink = async (accountName: any) => {
    router.push(`/agents/${accountName}`);
  };

  const isDisabled = paused || (!accountRoles.isAgentAdmin() && !isOwner);

  return (
    <>
      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader
            title="Agents"
            description={<>All the agents for this contract</>}
            actions={
              <AgentForm
                trigger={
                  <Button
                    isDisabled={isDisabled}
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
            <CompactTable
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
                      <Confirmation
                        onPress={handleDelete}
                        trigger={
                          <Button
                            isDisabled={isDisabled}
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
