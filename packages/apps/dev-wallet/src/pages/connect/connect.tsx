import { CardContent } from '@/App/LayoutLandingPage/components/CardContent';
import { useRequests } from '@/modules/communication/communication.provider';
import { MonoContacts } from '@kadena/kode-icons/system';
import { Button, Heading, Notification, Stack, Text } from '@kadena/kode-ui';
import { CardFooterGroup } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { wrapperClass } from '../errors/styles.css';

export function Connect({
  requestId,
  onAccept,
  onReject,
}: {
  requestId?: string;
  onAccept?: () => void;
  onReject?: () => void;
}) {
  const requests = useRequests();
  const [result, setResult] = useState<'none' | 'rejected' | 'accepted'>(
    'none',
  );

  useEffect(() => {
    setResult('none');
  }, [requestId]);

  if (!requestId) {
    return <div>Invalid request Id</div>;
  }
  const request = requests.get(requestId);
  if (!request) {
    return <div>Request not found</div>;
  }
  return (
    <>
      <CardContent
        label="Connection Request"
        description="Connect with your account"
        visual={<MonoContacts width={40} height={40} />}
      />
      <Stack
        padding={'sm'}
        gap={'lg'}
        flexDirection={'column'}
        className={wrapperClass}
      >
        <Heading as="h2">Login to: {(request.payload as any).name}</Heading>

        {result === 'accepted' && (
          <Notification role="status">
            Request accepted - you can go back to{' '}
            <Text bold> {(request.payload as any).name}</Text>
          </Notification>
        )}
        {result === 'rejected' && (
          <Notification role="alert">
            Request rejected - you can go back to{' '}
            <Text bold> {(request.payload as any).name}</Text>
          </Notification>
        )}

        {result === 'none' && (
          <CardFooterGroup>
            <Button
              variant="outlined"
              onPress={() => {
                request?.resolve({ status: 'rejected' });
                setResult('rejected');
                if (onReject) {
                  onReject();
                }
              }}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              onPress={() => {
                request?.resolve({ status: 'accepted' });
                setResult('accepted');
                if (onAccept) {
                  onAccept();
                }
              }}
            >
              Accept
            </Button>
          </CardFooterGroup>
        )}
      </Stack>
    </>
  );
}

export const ConnectPage = () => {
  const { requestId } = useParams();
  return <Connect requestId={requestId} />;
};
