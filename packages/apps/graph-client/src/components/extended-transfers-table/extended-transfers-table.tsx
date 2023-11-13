import { GetTransfersQuery } from '@/__generated__/sdk';
import routes from '@/constants/routes';
import type { FetchMoreOptions, FetchMoreQueryOptions } from '@apollo/client';
import { Box, Link, Pagination, Select, Table } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
type DataType = GetTransfersQuery;
interface IVariableType {
  first: number | null;
  last: number | null;
  after: string | null;
  before: string | null;
}

interface IExpandedTransfersTableProps {
  transfers: GetTransfersQuery['transfers'];
  fetchMore: (
    fetchMoreOptions: FetchMoreQueryOptions<IVariableType, DataType> &
      FetchMoreOptions,
  ) => Promise<any>;
}

export const ExtendedTransfersTable = (
  props: IExpandedTransfersTableProps,
): JSX.Element => {
  const { transfers, fetchMore } = props;

  const itemsPerPageOptions = [10, 50, 100, 200];

  // Parse the query parameters from the URL using Next.js router
  const router = useRouter();
  // const { page: urlPage, items: urlItemsPerPage } = router.query;
  const urlPage = router.query.page;
  const urlItemsPerPage = router.query.items;

  // Use state to manage itemsPerPage and currentPage
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    urlItemsPerPage &&
      itemsPerPageOptions.includes(parseInt(urlItemsPerPage as string))
      ? parseInt(urlItemsPerPage as string)
      : 10,
  );

  // Calculate the total number of pages available based on the total count
  const totalPages = Math.ceil(transfers.totalCount / itemsPerPage);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const refetchTransactions = async () => {
    await fetchMore({
      variables: {
        first: itemsPerPage,
        last: null,
        after: null,
        before: null,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await refetchTransactions();
      setCurrentPage(1);
    };
    fetchData().catch((err) => {
      console.error(err);
    });
  }, [itemsPerPage]);

  // Set items per page and page in URL when they change
  useEffect(() => {
    const updateUrl = async () => {
      if (
        urlItemsPerPage !== itemsPerPage.toString() ||
        urlPage !== currentPage.toString()
      ) {
        const query = {
          ...router.query,
          page: currentPage,
          items: itemsPerPage,
        };

        await router.push({
          pathname: router.pathname,
          query,
        });
      }
    };
    updateUrl().catch((err) => {
      console.error(err);
    });
  }, [currentPage, itemsPerPage, router, urlItemsPerPage, urlPage]);

  const handlePaginationClick = async (newPageNumber: number) => {
    if (newPageNumber > currentPage) {
      await fetchMore({
        variables: {
          first: itemsPerPage,
          last: null,
          after: transfers.pageInfo.endCursor,
          before: null,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return fetchMoreResult;
        },
      });
    } else if (newPageNumber < currentPage) {
      fetchMore({
        variables: {
          first: null,
          last: itemsPerPage,
          after: null,
          before: transfers.pageInfo.startCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          if (fetchMoreResult.transfers.edges.length < itemsPerPage) {
            return {
              ...prev,
              transfers: {
                ...fetchMoreResult.transfers,
                edges: [
                  ...fetchMoreResult.transfers.edges,
                  ...prev.transfers.edges,
                ].slice(0, itemsPerPage),
              },
            };
          }

          return fetchMoreResult;
        },
      });
    }

    setCurrentPage(newPageNumber);
  };

  return (
    <>
      <Box marginBottom="$3">
        <div style={{ float: 'left', textAlign: 'center' }}>
          <span style={{ display: 'inline-block' }}>Items per page: </span>

          <Select
            ariaLabel="items-per-page"
            id="items-per-page"
            onChange={(event) => setItemsPerPage(parseInt(event.target.value))}
            style={{ display: 'inline-block' }}
            defaultValue={itemsPerPage}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            totalPages={totalPages}
            label="pagination"
            currentPage={currentPage}
            onPageChange={handlePaginationClick}
          />
        </div>
      </Box>
      <Table.Root wordBreak="break-word">
        <Table.Head>
          <Table.Tr>
            <Table.Th>Chain</Table.Th>
            <Table.Th>Block Height</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Sender Account</Table.Th>
            <Table.Th>Receiver Account</Table.Th>
            <Table.Th>Request key</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {transfers.edges.map((edge, index) => {
            /**  These transfers are going to be added to their crosschain counterpart and
           this way we avoid repeated transfers in the table */
            if (edge.node.transaction?.pactId) {
              return <></>;
            }

            const chainIdDisplay = edge.node.crossChainTransfer
              ? `${edge.node.chainId} / ${edge.node.crossChainTransfer.chainId}`
              : edge.node.chainId;

            const heightDisplay = edge.node.crossChainTransfer
              ? `${edge.node.height} / ${edge.node.crossChainTransfer.height}`
              : edge.node.height;

            return (
              <Table.Tr key={index}>
                <Table.Td>{chainIdDisplay}</Table.Td>
                <Table.Td>{heightDisplay}</Table.Td>
                <Table.Td>{edge.node.amount}</Table.Td>
                <Table.Td>
                  <Link
                    href={`${routes.ACCOUNT}/${router.query.module}/${edge.node.senderAccount}`}
                  >
                    {edge.node.senderAccount}
                  </Link>
                </Table.Td>
                <Table.Td>
                  {edge.node.receiverAccount ? (
                    <Link
                      href={`${routes.ACCOUNT}/${router.query.module}/${edge.node.receiverAccount}`}
                    >
                      {edge.node.receiverAccount}
                    </Link>
                  ) : edge.node.crossChainTransfer?.receiverAccount ? (
                    <Link
                      href={`${routes.ACCOUNT}/${router.query.module}/${edge.node.crossChainTransfer.receiverAccount}`}
                    >
                      {edge.node.crossChainTransfer.receiverAccount}
                    </Link>
                  ) : (
                    <span style={{ color: 'lightgray' }}>N/A</span>
                  )}
                </Table.Td>
                <Table.Td>
                  <Link href={`${routes.TRANSACTIONS}/${edge.node.requestKey}`}>
                    {edge.node.requestKey}
                  </Link>
                  /
                  {edge.node.crossChainTransfer && (
                    <Link
                      href={`${routes.TRANSACTIONS}/${edge.node.crossChainTransfer.requestKey}`}
                    >
                      {edge.node.crossChainTransfer.requestKey}
                    </Link>
                  )}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table.Root>
    </>
  );
};
