import { useRequests } from '@/modules/communication/communication.provider';
import { Button, Heading, Notification, Stack, Text } from '@kadena/react-ui';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export function Connect() {
  const requests = useRequests();
  const { requestId } = useParams();
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
    <Stack padding={'sm'} gap={'lg'} flexDirection={'column'}>
      <Heading as="h1">Connection Request</Heading>
      <Text variant="code">{JSON.stringify(request)}</Text>
      {result === 'none' && (
        <Stack gap={'lg'}>
          <Button
            variant="primary"
            onPress={() => {
              console.log('Accepting request', request?.resolve);
              request?.resolve({ status: 'accepted' });
              setResult('accepted');
            }}
          >
            <div>Accept</div>
          </Button>
          <Button
            onPress={() => {
              console.log('Rejecting request');
              request?.resolve({ status: 'rejected' });
              setResult('rejected');
            }}
          >
            <div>reject</div>
          </Button>
        </Stack>
      )}
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
    </Stack>
  );
}
