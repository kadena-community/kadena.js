import { useEstimateGasLimitQuery } from '@/__generated__/sdk';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import routes from '@/constants/routes';
import { estimateGasLimit } from '@/graphql/queries.graph';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Cell,
  Column,
  Notification,
  Row,
  Stack,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
import { useRouter } from 'next/router';
import React from 'react';

const GasEstimation: React.FC = () => {
  const router = useRouter();

  const variables = {
    input: router.query.input as string,
  };

  const { loading, data, error } = useEstimateGasLimitQuery({
    variables,
    skip: !router.query.input,
  });

  return (
    <>
      <Stack justifyContent="space-between">
        <Breadcrumbs>
          <BreadcrumbsItem href={`${routes.HOME}`}>Home</BreadcrumbsItem>
          <BreadcrumbsItem>Gas Limit Estimation</BreadcrumbsItem>
        </Breadcrumbs>
        <GraphQLQueryDialog
          queries={[{ query: estimateGasLimit, variables }]}
        />
      </Stack>

      <Box margin="md" />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Waiting for gas limit estimation..."
      />

      {data?.gasLimitEstimate?.length && data.gasLimitEstimate[0] ? (
        <Table isCompact className={atoms({ wordBreak: 'break-word' })}>
          <TableHeader>
            <Column>Type</Column>
            <Column>Value</Column>
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>Input</Cell>
              <Cell>{router.query.input}</Cell>
            </Row>
            <Row>
              <Cell>Gas Limit Estimate</Cell>
              <Cell>{data?.gasLimitEstimate[0].amount}</Cell>
            </Row>
            <Row>
              <Cell>The detected input type</Cell>
              <Cell>{data?.gasLimitEstimate[0].inputType}</Cell>
            </Row>
            <Row>
              <Cell>Was preflight used</Cell>
              <Cell>{data?.gasLimitEstimate[0].usedPreflight.toString()}</Cell>
            </Row>
            <Row>
              <Cell>Was signature verification used</Cell>
              <Cell>
                {data?.gasLimitEstimate[0].usedSignatureVerification.toString()}
              </Cell>
            </Row>
            <Row>
              <Cell>The transaction that was generated and used</Cell>
              <Cell>{data?.gasLimitEstimate[0].transaction}</Cell>
            </Row>
          </TableBody>
        </Table>
      ) : (
        <Notification role="alert" intent="negative">
          Unable to display gas limit estimation.
        </Notification>
      )}
    </>
  );
};

export default GasEstimation;
