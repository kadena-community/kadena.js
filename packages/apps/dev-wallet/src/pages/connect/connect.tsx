import { useRequests } from '@/modules/communication/communication.provider';
import { Button, Heading, Stack, Text } from '@kadena/react-ui';
import { useSearchParams } from 'react-router-dom';

export function Connect() {
  const requests = useRequests();
  const [queryParams] = useSearchParams();
  const requestId = queryParams.get('requestId');
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
      <Stack gap={'lg'}>
        <Button
          variant="primary"
          onPress={() => {
            console.log('Accepting request', request?.resolve);
            request?.resolve({ status: 'success' });
          }}
        >
          <div>Accept</div>
        </Button>
        <Button
          onPress={() => {
            console.log('Rejecting request');
            request?.reject({ status: 'failed' });
          }}
        >
          <div>reject</div>
        </Button>
      </Stack>
    </Stack>
  );
}
