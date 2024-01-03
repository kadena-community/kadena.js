import type { Event } from '@/__generated__/sdk';
import routes from '@/constants/routes';
import { formatCode } from '@/utils/formatter';
import { Table } from '@kadena/react-ui';
import React from 'react';

interface IEventsTableProps {
  events?: Event[];
}

export const EventsTable = (props: IEventsTableProps): JSX.Element => {
  const { events = [] } = props;

  return (
    <>
      <Table.Root striped wordBreak="break-word">
        <Table.Head>
          <Table.Tr>
            <Table.Th>Block Height</Table.Th>
            <Table.Th>Chain ID</Table.Th>
            <Table.Th>Parameters</Table.Th>
            <Table.Th>Request Key</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {events.map((event, index) => (
            <Table.Tr
              key={index}
              url={`${routes.TRANSACTIONS}/${event.requestKey}`}
            >
              <Table.Td>{event.height}</Table.Td>
              <Table.Td>{event.chainId}</Table.Td>
              <Table.Td>
                <Table.Root>
                  <Table.Body>
                    {JSON.parse(event.parameterText).map(
                      (parameter: any, index: number) => (
                        <Table.Tr key={`arguments-${index}`}>
                          <Table.Td>
                            {typeof parameter === 'string' ? (
                              parameter
                            ) : Array.isArray(parameter) ? (
                              <Table.Root>
                                <Table.Body>
                                  {parameter.map(
                                    (subparameter: any, index: number) => (
                                      <Table.Tr key={`arguments-${index}`}>
                                        <Table.Td>
                                          {typeof subparameter === 'string' ? (
                                            subparameter
                                          ) : (
                                            <pre>
                                              {formatCode(
                                                JSON.stringify(subparameter),
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
              <Table.Td>{event.requestKey}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
};
