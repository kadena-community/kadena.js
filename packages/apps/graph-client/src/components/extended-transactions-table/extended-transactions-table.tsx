import { Box, Link, Pagination, Select, Table } from '@kadena/react-ui';

import type { GetTransactionsQuery } from '@/__generated__/sdk';
import routes from '@/constants/routes';
import { formatLisp } from '@/utils/formatter';
import type { FetchMoreOptions, FetchMoreQueryOptions } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

type DataType = GetTransactionsQuery;

interface IVariableType {
  first: number | null;
  last: number | null;
  after: string | null;
  before: string | null;
}

interface IExpandedTransactionsTableProps {
  transactions: GetTransactionsQuery['transactions'];
  fetchMore: (
    fetchMoreOptions: FetchMoreQueryOptions<IVariableType, DataType> &
      FetchMoreOptions,
  ) => Promise<any>;
}

export const ExtendedTransactionsTable = (
  props: IExpandedTransactionsTableProps,
): JSX.Element => {
  const { transactions, fetchMore } = props;

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
  const totalPages = Math.ceil(transactions.totalCount / itemsPerPage);

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
          after: transactions.pageInfo.endCursor,
          before: null,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return fetchMoreResult;
        },
      });
    } else if (newPageNumber < currentPage) {
      await fetchMore({
        variables: {
          first: null,
          last: itemsPerPage,
          after: null,
          before: transactions.pageInfo.startCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          if (fetchMoreResult.transactions.edges.length < itemsPerPage) {
            return {
              ...prev,
              transactions: {
                ...fetchMoreResult.transactions,
                edges: [
                  ...fetchMoreResult.transactions.edges,
                  ...prev.transactions.edges,
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
            <Table.Th>Timestamp</Table.Th>
            <Table.Th>Block Height</Table.Th>
            <Table.Th>Request Key</Table.Th>
            <Table.Th>Code</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {transactions.edges.map((edge, index) => {
            return (
              <Table.Tr key={index}>
                <Table.Td>{edge.node.chainId}</Table.Td>
                <Table.Td>
                  {new Date(edge.node.creationTime).toLocaleString()}
                </Table.Td>
                <Table.Td>{edge.node.height}</Table.Td>
                <Table.Td>
                  <Link href={`${routes.TRANSACTIONS}/${edge.node.requestKey}`}>
                    {edge.node.requestKey}
                  </Link>
                </Table.Td>
                <Table.Td>
                  {edge.node.code ? (
                    <pre>{formatLisp(JSON.parse(edge.node.code))}</pre>
                  ) : (
                    <span style={{ color: 'lightgray' }}>N/A</span>
                  )}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table.Root>
      <span
        style={{ float: 'right' }}
      >{`Page ${currentPage} out of ${totalPages}`}</span>
    </>
  );
};
