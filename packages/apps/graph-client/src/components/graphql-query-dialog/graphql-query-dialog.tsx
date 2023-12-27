import { Button, Dialog, DialogContent, Divider } from '@kadena/react-ui';
import type { DocumentNode } from 'graphql';
import { print } from 'graphql';
import React, { useState } from 'react';

interface IGraphQLQueryDialog {
  queries: DocumentNode[];
  variables: Record<string, unknown>;
}

export const GraphQLQueryDialog = (props: IGraphQLQueryDialog): JSX.Element => {
  const { queries, variables } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        icon="Information"
        title="Show the GraphQL query used."
        variant="compact"
        onClick={() => setIsOpen(true)}
      >
        GraphQL
      </Button>
      <Dialog
        isOpen={isOpen}
        onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      >
        {() => (
          <DialogContent>
            <p>Query</p>
            {queries.map((query, index) => (
              <pre key={index}>{print(query)}</pre>
            ))}
            <Divider />
            <p>Variables</p>
            <pre>{JSON.stringify(variables, null, 2)}</pre>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
