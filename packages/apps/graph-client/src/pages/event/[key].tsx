import { Notification, Table } from '@kadena/react-ui';

import {
  useGetEventByNameSubscription,
  useGetTransactionsByEventSubscription,
} from '../../__generated__/sdk';
import Loader from '../../components/loader/loader';
import { Text } from '../../components/text';
import { styled } from '../../styles/stitches.config';

import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import routes from '../../constants/routes';

const StyledMain = styled('main', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  my: '5rem',
});

const Event: React.FC = () => {
  const router = useRouter();

  const {
    loading: eventLoading,
    data: eventSubscription,
    error,
  } = useGetEventByNameSubscription({
    variables: { eventName: router.query.key as string },
  });

  return (
    <div>
      <Head>
        <title>Kadena Graph Client</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <StyledMain>
        <Text
          as="h1"
          css={{ display: 'block', color: '$mauve12', fontSize: 48, my: '$12' }}
        >
          Kadena Graph Client
        </Text>

        <div>
          {eventLoading && (
            // Display a loading spinner next to the text without a gap
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Waiting for event...</span>
            </div>
          )}

          {error && (
            <Notification.Root color="negative" icon="Close">
              Unknown error:
              <br />
              <br />
              <code>{error.message}</code>
              <br />
              <br />
              Check if the Graph server is running.
            </Notification.Root>
          )}

          {eventSubscription?.event && (
            <div style={{ maxWidth: '1000px' }}>
              <Table.Root striped wordBreak="break-word">
                <Table.Head>
                  <Table.Tr>
                    <Table.Th>Event Name</Table.Th>
                    <Table.Th>Parameters</Table.Th>
                    <Table.Th>Request Key</Table.Th>
                  </Table.Tr>
                </Table.Head>
                <Table.Body>
                  {eventSubscription.event.map((event, index) => (
                    <Table.Tr
                      key={index}
                      url={`${routes.TRANSACTION}/${event.transaction?.requestKey}`}
                    >
                      <Table.Td>{event.qualName}</Table.Td>
                      <Table.Td>
                        <pre>
                          {JSON.stringify(JSON.parse(event.paramText), null, 2)}
                        </pre>
                      </Table.Td>
                      <Table.Td>{event.transaction?.requestKey}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Body>
              </Table.Root>
            </div>
          )}
        </div>
      </StyledMain>
    </div>
  );
};

export default Event;
