import type { Event } from '@/__generated__/sdk';
import routes from '@/constants/routes';
import { formatCode } from '@/utils/formatter';
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React from 'react';
import { compactTableClass } from '../common/compact-table/compact-table.css';

interface IEventsTableProps {
  events?: Event[];
}

export const EventsTable = (props: IEventsTableProps): JSX.Element => {
  const { events = [] } = props;

  return (
    <>
<<<<<<< HEAD
      <Table.Root striped wordBreak="break-word" className={compactTableClass}>
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
=======
      <Table isStriped className={atoms({ wordBreak: 'break-all' })}>
        <TableHeader>
          <Column>Block Height</Column>
          <Column>Chain ID</Column>
          <Column>Parameters</Column>
          <Column>Request Key</Column>
          <Column> </Column>
        </TableHeader>
        <TableBody>
>>>>>>> 0e5aaafd1 (updated tools)
          {events.map((event, index) => (
            <Row
              key={index}
              href={`${routes.TRANSACTIONS}/${event.requestKey}`}
            >
              <Cell>{event.height}</Cell>
              <Cell>{event.chainId}</Cell>
              <Cell>
                <Table>
                  <TableBody>
                    {JSON.parse(event.parameterText).map(
                      (parameter: any, index: number) => (
                        <Row key={`arguments-${index}`}>
                          <Cell>
                            {typeof parameter === 'string' ? (
                              parameter
                            ) : Array.isArray(parameter) ? (
                              <Table>
                                <TableBody>
                                  {parameter.map(
                                    (subparameter: any, index: number) => (
                                      <Row key={`arguments-${index}`}>
                                        <Cell>
                                          {typeof subparameter === 'string' ? (
                                            subparameter
                                          ) : (
                                            <pre>
                                              {formatCode(
                                                JSON.stringify(subparameter),
                                              )}
                                            </pre>
                                          )}
                                        </Cell>
                                      </Row>
                                    ),
                                  )}
                                </TableBody>
                              </Table>
                            ) : (
                              JSON.stringify(parameter)
                            )}
                          </Cell>
                        </Row>
                      ),
                    )}
                  </TableBody>
                </Table>
              </Cell>
              <Cell>{event.requestKey}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
