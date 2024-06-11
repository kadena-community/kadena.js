import { AuthCard } from '@/Components/AuthCard/AuthCard';
import {
  Text,
  Button,
  Heading,
  Notification,
  NotificationFooter,
  NotificationHeading,
  Stack,
  Dialog
} from '@kadena/react-ui';
import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { warningDialog } from './styles.css.ts';

export function BackupRecoveryPhrase() {
  const { keySourceId } = useParams();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const acceptWarning = (): void => {
    setModalOpen(false);
    navigate(`/backup-recovery-phrase/${keySourceId}/write-down`);
  }

  return (
    <>
      <AuthCard>
        <Heading variant="h5">Save your recovery key</Heading>
        <Text>
          Secure your assets by writing down or exporting 
          your recovery phrase. Otherwise you will lose 
          your assets if this wallet is deleted.
        </Text>
        <Heading as="h6">Recovery phrase</Heading>
        <Stack gap="md" flexWrap="wrap">
          {[...Array(12)].map((e, index) => {
            return (
              <span key={index}>
                {index + 1} *****
              </span>
            )
          })}
        </Stack>
        <Stack flexDirection="column" gap="md">
          <Button
            variant="outlined"
            onPress={() => navigate(`/backup-recovery-phrase/${keySourceId}/write-down`)}
          >
            Export encrypted file
          </Button>
          <Button
            variant="primary"
            onPress={() => setModalOpen(true)}
          >
            Write it down
          </Button>
        </Stack>
      </AuthCard>
      <Link to="/">Skip step</Link>

      <Dialog
        onOpenChange={() => setModalOpen(false)}
        isOpen={modalOpen}
        size="sm"
        className={warningDialog}
      >
        <Notification
          intent="warning"
          role="alert"
          type="inlineStacked"
        >
          <NotificationHeading>
            Warning
          </NotificationHeading>
          <Text>
            Your Secret Recovery Phrase provides full access to your wallet and funds. 
            Please be aware that malicious softwares can monitor the clipboard, 
            your keyboard or record the screen.
          </Text>
          <NotificationFooter>
            <Button
              variant="warning"
              className="acceptWarningButton"
              onPress={() => acceptWarning()}
            >
              Understood
            </Button>
          </NotificationFooter> 
        </Notification>
      </Dialog>
    </>
  );
}
