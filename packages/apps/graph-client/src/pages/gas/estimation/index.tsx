import { useEstimateGasLimitQuery } from '@/__generated__/sdk';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import routes from '@/constants/routes';
import { estimateGasLimit } from '@/graphql/queries.graph';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Stack,
  Table,
} from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const GasEstimation: React.FC = () => {
  const router = useRouter();
  const { cmd, hash, sigs } = router.query;

  const cmdString = cmd as string;
  const hashString = hash as string;
  const sigsString = sigs as string;
  const sigsArray = sigsString ? sigsString.split(',') : [];

  const variables = {
    transaction: { cmd: cmdString, hash: hashString, sigs: sigsArray },
  };

  const { loading, data, error } = useEstimateGasLimitQuery({
    variables,
    skip: !cmdString || !hashString || !sigsString,
  });

  return (
    <>
      <Stack justifyContent="space-between">
        <Breadcrumbs>
          <BreadcrumbsItem href={`${routes.HOME}`}>Home</BreadcrumbsItem>
          <BreadcrumbsItem>Gas Estimation</BreadcrumbsItem>
        </Breadcrumbs>
        <GraphQLQueryDialog
          queries={[{ query: estimateGasLimit, variables }]}
        />
      </Stack>

      <Box margin="md" />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Waiting for gas estimation..."
      />

      <Table.Root wordBreak="break-all">
        <Table.Head>
          <Table.Tr>
            <Table.Th>Label</Table.Th>
            <Table.Th>Value</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          <Table.Tr>
            <Table.Td>Cmd</Table.Td>
            <Table.Td>{cmdString}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Gas Estimate</Table.Td>
            <Table.Td>{data?.gasLimitEstimate}</Table.Td>
          </Table.Tr>
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default GasEstimation;
