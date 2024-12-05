import { useAsset } from '@/hooks/asset';
import { useGetAgents } from '@/hooks/getAgents';
import { useRemoveAgent } from '@/hooks/removeAgent';
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

export const AgentsList: FC = () => {
  const { paused } = useAsset();
  const { data } = useGetAgents();
  const { submit } = useRemoveAgent();
  const router = useRouter();

  const handleDelete = async (accountName: any) => {
    await submit({ agent: accountName });
  };

  const handleLink = async (accountName: any) => {
    router.push(`/agents/${accountName}`);
  };

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
                    isDisabled={paused}
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
              fields={[
                {
                  label: 'Name',
                  key: 'alias',
                  width: '30%',
                },
                {
                  label: 'Account',
                  key: 'accountName',
                  width: '50%',
                  render: CompactTableFormatters.FormatAccount(),
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
              data={data}
            />
          </SectionCardBody>
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
};
