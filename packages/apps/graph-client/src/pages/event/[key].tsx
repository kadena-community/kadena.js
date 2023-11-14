import { useGetEventByNameSubscription } from '@/__generated__/sdk';
import Loader from '@/components/Common/loader/loader';
import LoaderAndError from '@/components/LoaderAndError/loader-and-error';
import { ErrorBox } from '@/components/error-box/error-box';
import { formatCode } from '@/utils/formatter';
import routes from '@constants/routes';
import { Box, Breadcrumbs, Table } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const Event: React.FC = () => {
  const router = useRouter();

  const { loading, data, error } = useGetEventByNameSubscription({
    variables: { eventName: router.query.key as string },
  });

  return (
    <>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>Events</Breadcrumbs.Item>
      </Breadcrumbs.Root>

      <Box marginBottom="$8" />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Waiting for event..."
      />

      {error && <ErrorBox error={error} />}

      {data?.event && (
        <>
          <Table.Root striped wordBreak="break-word">
            <Table.Head>
              <Table.Tr>
                <Table.Th>Event Name</Table.Th>
                <Table.Th>Parameters</Table.Th>
                <Table.Th>Request Key</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Head>
            <Table.Body>
              {data.event.map((event, index) => (
                <Table.Tr
                  key={index}
                  url={`${routes.TRANSACTIONS}/${event.transaction?.requestKey}`}
                >
                  <Table.Td>{event.qualifiedName}</Table.Td>
                  <Table.Td>
                    <Table.Root>
                      <Table.Body>
                        {JSON.parse(event.parameterText).map(
                          (parameter: any, index: number) => (
                            <Table.Tr key={`arguments-${index}`}>
                              <Table.Td>
                                {typeof parameter === 'string' ? (
                                  parameter
                                ) : typeof parameter === 'object' ? (
                                  <Table.Root>
                                    <Table.Body>
                                      {parameter.map(
                                        (subparameter: any, index: number) => (
                                          <Table.Tr key={`arguments-${index}`}>
                                            <Table.Td>
                                              {typeof subparameter ===
                                              'string' ? (
                                                subparameter
                                              ) : (
                                                <pre>
                                                  {formatCode(
                                                    JSON.stringify(
                                                      subparameter,
                                                    ),
                                                  )}
                                                </pre>
                                              )}
                                            </Table.Td>
                                          </Table.Tr>
                                        ),
                                      )}
                                    </Table.Body>
                                  </Table.Root>
                                ) : (
                                  JSON.stringify(parameter)
                                )}
                              </Table.Td>
                            </Table.Tr>
                          ),
                        )}
                      </Table.Body>
                    </Table.Root>
                  </Table.Td>
                  <Table.Td>{event.transaction?.requestKey}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Body>
          </Table.Root>
        </>
      )}
    </>
  );
};

export default Event;
