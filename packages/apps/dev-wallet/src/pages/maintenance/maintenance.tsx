import { CardContent } from '@/App/LayoutLandingPage/components/CardContent';
import { LandingPageLayout } from '@/App/LayoutLandingPage/Layout';
import { useMaintenance } from '@/Components/MaintenanceProvider/MaintenanceProvider';
import { env } from '@/utils/env';
import { MonoPrivacyTip } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { wrapperClass } from '../errors/styles.css';
import { iconColorClass } from './styles.css';

export const Maintenance: FC = () => {
  const { refreshMaintenanceMode } = useMaintenance();

  return (
    <LandingPageLayout>
      <CardContent
        visual={
          <Stack className={iconColorClass}>
            <MonoPrivacyTip width={36} height={36} />
          </Stack>
        }
        description=""
        label="Maintenance"
        key="maintenance"
      />
      <Stack
        flexDirection="column"
        gap="xxl"
        style={{ marginBlockStart: '-80px' }}
        marginBlockEnd="xxxl"
        className={wrapperClass}
      >
        <Stack flexDirection="column">
          <Heading variant="h5">Temporarily unreachable</Heading>
          <Text>
            It seems that the page you are trying to access in not available.
          </Text>
        </Stack>

        <Stack flexDirection="column">
          <Heading variant="h6">Planned downtime</Heading>
          <Text>
            <ReactMarkdown>{env.MAINTENANCE_MESSAGE}</ReactMarkdown>
          </Text>
        </Stack>
        <Stack flexDirection="column">
          <Heading variant="h6">Reach out!</Heading>
          <Text>
            Please don’t hesitate to reach out if you have any concerns or
            believe there may be an issue with the system. We’re here to help!
          </Text>
        </Stack>

        <Stack justifyContent="flex-end" gap="md">
          <a href="https://discord.com/invite/kadena" target="_blank">
            <Button variant="outlined">Get support</Button>
          </a>
          <Button variant="primary" onPress={refreshMaintenanceMode}>
            Retry
          </Button>
        </Stack>
      </Stack>
    </LandingPageLayout>
  );
};
