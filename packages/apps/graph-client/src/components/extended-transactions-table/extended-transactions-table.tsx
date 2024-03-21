import {
  Box,
  Cell,
  Column,
  Link,
  Pagination,
  Row,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/react-ui';

import type { GetTransactionsQuery } from '@/__generated__/sdk';
import routes from '@/constants/routes';
import { formatLisp } from '@/utils/formatter';
import type { FetchMoreOptions, FetchMoreQueryOptions } from '@apollo/client';
import { atoms } from '@kadena/react-ui/styles';
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

const itemsPerPageOptions = [10, 50, 100, 200].map((x) => ({
  label: x.toString(),
  value: x,
}));

export const ExtendedTransactionsTable = (
  props: IExpandedTransactionsTableProps,
): JSX.Element => {
  const { transactions, fetchMore } = props;

  // Parse the query parameters from the URL using Next.js router
  const router = useRouter();
  const urlPage = router.query.page;
  const urlItemsPerPage = router.query.items;

  // Use state to manage itemsPerPage and currentPage
  const [itemsPerPage, setItemsPerPage] = useState<number>(() =>
    urlItemsPerPage &&
    itemsPerPageOptions.some(
      (option) => option.value === parseInt(urlItemsPerPage as string),
    )
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
      <Box margin="sm">
        <div style={{ float: 'left', textAlign: 'center' }}>
          <span style={{ display: 'inline-block' }}>Items per page: </span>

          <Select
            aria-label="items-per-page"
            id="items-per-page"
            onSelectionChange={(key) =>
              setItemsPerPage(typeof key === 'string' ? parseInt(key) : key)
            }
            defaultSelectedKey={itemsPerPage}
            items={itemsPerPageOptions}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            totalPages={totalPages}
            selectedPage={currentPage}
            onPageChange={handlePaginationClick}
          />
        </div>
      </Box>
      <Table className={atoms({ wordBreak: 'break-word' })} isCompact>
        <TableHeader>
          <Column>Chain</Column>
          <Column>Timestamp</Column>
          <Column>Block Height</Column>
          <Column>Request Key</Column>
          <Column>Code</Column>
        </TableHeader>
        <TableBody>
          {transactions.edges.map((edge, index) => {
            return (
              <Row key={index}>
                <Cell>{edge.node.cmd.meta.chainId}</Cell>
                <Cell>
                  {new Date(edge.node.cmd.meta.creationTime).toLocaleString()}
                </Cell>
                <Cell>
                  {edge.node.result.__typename === 'TransactionInfo' ? (
                    edge.node.result.height
                  ) : (
                    <span style={{ color: 'lightgray' }}>N/A</span>
                  )}
                </Cell>
                <Cell>
                  <Link href={`${routes.TRANSACTIONS}/${edge.node.hash}`}>
                    {edge.node.hash}
                  </Link>
                </Cell>
                <Cell>
                  {edge.node.cmd.payload.__typename === 'ExecutionPayload' &&
                  edge.node.cmd.payload.code ? (
                    <pre>
                      {formatLisp(JSON.parse(edge.node.cmd.payload.code))}
                    </pre>
                  ) : (
                    <span style={{ color: 'lightgray' }}>N/A</span>
                  )}
                </Cell>
              </Row>
            );
          })}
        </TableBody>
      </Table>
      <span
        style={{ float: 'right' }}
      >{`Page ${currentPage} out of ${totalPages}`}</span>
    </>
  );
};
