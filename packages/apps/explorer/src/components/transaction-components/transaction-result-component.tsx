import DataRenderComponent from '@/components/data-render-component/data-render-component';
import React from 'react';

export const TransactionResultComponent: React.FC<{
  transactionResult: any;
}> = ({ transactionResult }) => {
  return (
    <>
      <DataRenderComponent
        title="Block"
        fields={[
          { key: 'Height', value: transactionResult.block.height },
          { key: 'Hash', value: transactionResult.block.hash },
          { key: 'Created', value: transactionResult.block.creationTime },
        ]} />
      <DataRenderComponent
        title="Result"
        fields={[
          { key: 'Logs', value: transactionResult.logs },
          { key: 'Gas', value: transactionResult.gas },
          { key: 'Bad Result', value: transactionResult.badResult },
          { key: 'Transaction ID', value: transactionResult.transactionId },
          { key: 'Continuation', value: transactionResult.continuation },
          { key: 'Metadata', value: transactionResult.metadata },
        ]} />
      <DataRenderComponent
        title="Events"
        fields={transactionResult.events.edges
          .map(
            (edge) => edge && {
              key: edge?.node.qualifiedName,
              value: (JSON.parse(edge?.node.parameters) as any[]).map(
                (param) => JSON.stringify(param)
              ),
            }
          )
          .filter(Boolean)} />
    </>
  );
};
