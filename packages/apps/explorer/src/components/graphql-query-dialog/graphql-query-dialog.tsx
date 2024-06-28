import { useQueryContext } from '@/context/query-context';
import { MonoHub } from '@kadena/react-icons/system';
import { Box, Button, Dialog, DialogContent, Divider } from '@kadena/react-ui';
import { print } from 'graphql';
import React, { useState } from 'react';
import { buttonSizeClass } from '../header/styles.css';

export const GraphQLQueryDialog = (): JSX.Element => {
  let { queries } = useQueryContext();

  if (!queries) queries = [];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className={buttonSizeClass}
        startVisual={<MonoHub />}
        title="Show the GraphQL query used."
        variant="transparent"
        onPress={() => setIsOpen(true)}
      ></Button>
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
