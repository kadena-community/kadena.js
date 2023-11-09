import { useEstimateGasLimitQuery } from '@/__generated__/sdk';
import Loader from '@/components/Common/loader/loader';
import { ErrorBox } from '@/components/error-box/error-box';
import routes from '@/constants/routes';
import { Box, Breadcrumbs, Table } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const GasEstimation: React.FC = () => {
  const router = useRouter();
  const { cmd, hash, sigs } = router.query;

  const cmdString = cmd as string;
  const hashString = hash as string;
  const sigsString = sigs as string;
  const sigsArray = sigsString ? sigsString.split(',') : [];

  const { loading, data, error } = useEstimateGasLimitQuery({
    variables: {
      transaction: { cmd: cmdString, hash: hashString, sigs: sigsArray },
    },
  });

  return (
    <>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>Gas Estimation</Breadcrumbs.Item>
      </Breadcrumbs.Root>

      <Box marginBottom="$8" />

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Loader /> <span>Waiting for gas estimation...</span>
        </div>
      )}
      {error && <ErrorBox error={error} />}
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
