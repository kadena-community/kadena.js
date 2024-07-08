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
} from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
import React from 'react';

interface IEventsTableProps {
  events?: Event[];
}

export const EventsTable = (props: IEventsTableProps): JSX.Element => {
  const { events = [] } = props;

  return (
    <>
      <Table isStriped className={atoms({ wordBreak: 'break-all' })} isCompact>
        <TableHeader>
          <Column>Block Height</Column>
          <Column>Chain ID</Column>
          <Column>Parameters</Column>
          <Column>Request Key</Column>
        </TableHeader>
        <TableBody>
          {events.map((event, index) => (
            <Row
              key={index}
              href={`${routes.TRANSACTIONS}/${event.requestKey}`}
            >
              <Cell>{event.height}</Cell>
              <Cell>{event.chainId}</Cell>
              <Cell>
                <Table>
                  <TableHeader>
                    <Column>Values</Column>
                  </TableHeader>
                  <TableBody>
                    {JSON.parse(event.parameterText).map(
                      (parameter: any, index: number) => (
                        <Row key={`arguments-${index}`}>
                          <Cell>
                            {typeof parameter === 'string' ? (
                              parameter
                            ) : Array.isArray(parameter) ? (
                              <Table>
                                <TableHeader>
                                  <Column>Values</Column>
                                </TableHeader>
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
