import { AuthCard } from '@/Components/AuthCard/AuthCard';
import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { MonoDashboardCustomize } from '@kadena/kode-icons/system';
import { Box, Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { Link } from 'react-router-dom';
<SideBarBreadcrumbs icon={<MonoDashboardCustomize />}>
  <SideBarBreadcrumbsItem href="/">Dashboard</SideBarBreadcrumbsItem>
  <SideBarBreadcrumbsItem href="/terminal">Dev Console</SideBarBreadcrumbsItem>
</SideBarBreadcrumbs>;
export function BackupRecoveryPhrase() {
  return (
    <>
      <SideBarBreadcrumbs icon={<MonoDashboardCustomize />}>
        <SideBarBreadcrumbsItem href="/">Dashboard</SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href="/backup-recovery-phrase">
          Backup
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      <AuthCard>
        <Box margin="md">
          <Heading variant="h5">Backup the recovery phrase</Heading>
          <Text>
            With recovery phrase you can recover your wallet; you should
            consider everyone with the phrase have access to your assets
          </Text>
          <Heading variant="h5">Choose a method</Heading>
          <Stack justifyContent={'space-between'}>
            <Link to={`/backup-recovery-phrase/write-down`}>
              <Button>Write down the phrase</Button>
            </Link>
            <Link to="/">
              <Button variant="transparent">Skip</Button>
            </Link>
          </Stack>
        </Box>
      </AuthCard>
    </>
  );
}
