import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  SystemIcon,
} from '@kadena/react-ui';
import type { DocumentNode } from 'graphql';
import { print } from 'graphql';
import React, { useState } from 'react';

interface IGraphQLQueryDialogProps {
  queries: {
    query: DocumentNode;
    variables?: Record<string, unknown>;
  }[];
}

export const GraphQLQueryDialog = (
  props: IGraphQLQueryDialogProps,
): JSX.Element => {
  const { queries } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        icon={<SystemIcon.Information />}
        title="Show the GraphQL query used."
        isCompact
        variant="transparent"
        onPress={() => setIsOpen(true)}
      >
        GraphQL
      </Button>
      <Dialog
        isOpen={isOpen}
        onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      >
        {() => (
          <DialogContent>
            <p>Amount of queries on this page: {queries.length}</p>
            <Divider />
            {queries.map((query, index) => (
              <div key={index}>
                <p>Query #{index + 1}</p>
                <Box marginBlockEnd="sm" />
                <pre>{print(query.query)}</pre>
                {query.variables && (
                  <>
                    <Box marginBlockEnd="sm" />
                    <p>Variables</p>
                    <Box marginBlockEnd="sm" />
                    <pre>{JSON.stringify(query.variables, null, 2)}</pre>
                  </>
                )}
                {index + 1 !== queries.length && <Divider />}
              </div>
            ))}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
