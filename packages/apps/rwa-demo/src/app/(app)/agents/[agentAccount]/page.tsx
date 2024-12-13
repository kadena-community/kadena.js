'use client';

import { AgentForm } from '@/components/AgentForm/AgentForm';
import { AgentInfo } from '@/components/AgentInfo/AgentInfo';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useGetAgent } from '@/hooks/getAgent';
import { MonoEditNote } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useParams } from 'next/navigation';

const InvestorPage = () => {
  const { paused } = useAsset();
  const { accountRoles } = useAccount();
  const params = useParams();
  const agentAccount = decodeURIComponent(params.agentAccount as string);

  const { data: agent } = useGetAgent({ account: agentAccount });

  if (!agent) return null;

  const isDisabled = paused || !accountRoles.isAgentAdmin();
  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem href="/agents">Agents</SideBarBreadcrumbsItem>

        <SideBarBreadcrumbsItem href={`/agents/${agentAccount}`}>
          {agent.alias}
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack width="100%" flexDirection="column">
        <AgentInfo account={agent} />
        <Stack gap="sm">
          <AgentForm
            agent={agent}
            trigger={
              <Button isDisabled={isDisabled} endVisual={<MonoEditNote />}>
                Edit Agent
              </Button>
            }
          />
        </Stack>
      </Stack>
    </>
  );
};

export default InvestorPage;
