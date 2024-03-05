import type {
  GetTransfersQuery,
  QueryTransfersConnection,
} from '@/__generated__/sdk';
import routes from '@/constants/routes';
import type { FetchMoreOptions, FetchMoreQueryOptions } from '@apollo/client';
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
import { atoms } from '@kadena/react-ui/styles';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

type DataType = GetTransfersQuery;
interface IVariableType {
  first: number | null;
  last: number | null;
  after: string | null;
  before: string | null;
}

interface IExpandedTransfersTableProps {
  transfers: QueryTransfersConnection;
  fetchMore: (
    fetchMoreOptions: FetchMoreQueryOptions<IVariableType, DataType> &
      FetchMoreOptions,
  ) => Promise<any>;
}

const itemsPerPageOptions = [10, 50, 100, 200].map((x) => ({
  label: x.toString(),
  value: x,
}));

export const ExtendedTransfersTable = (
  props: IExpandedTransfersTableProps,
): JSX.Element => {
  const { transfers, fetchMore } = props;

  // Parse the query parameters from the URL using Next.js router
  const router = useRouter();
  // const { page: urlPage, items: urlItemsPerPage } = router.query;
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
      await fetchMore({
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
      <Box margin="sm">
        <div style={{ float: 'left', textAlign: 'center' }}>
          <span style={{ display: 'inline-block' }}>Items per page: </span>

          <Select
            aria-label="items-per-page"
            id="items-per-page"
            onSelectionChange={(key) =>
              setItemsPerPage(typeof key === 'string' ? parseInt(key) : key)
            }
            items={itemsPerPageOptions}
            defaultSelectedKey={itemsPerPage}
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
          <Column>Amount</Column>
          <Column>Sender Account</Column>
          <Column>Receiver Account</Column>
          <Column>Request key</Column>
        </TableHeader>
        <TableBody>
          {transfers.edges.map((edge, index) => {
            /**  These transfers are going to be added to their crosschain counterpart and
           this way we avoid repeated transfers in the table */
            if (
              edge.node.transaction?.cmd.payload.__typename ===
              'ContinuationPayload'
            ) {
              return <></>;
            }

            const chainIdDisplay = edge.node.crossChainTransfer
              ? `${edge.node.chainId} / ${edge.node.crossChainTransfer.chainId}`
              : edge.node.chainId;

            const heightDisplay = edge.node.crossChainTransfer
              ? `${edge.node.height} / ${edge.node.crossChainTransfer.height}`
              : edge.node.height;

            return (
              <Row key={index}>
                <Cell>{chainIdDisplay}</Cell>
                <Cell>{new Date(edge.node.creationTime).toLocaleString()}</Cell>
                <Cell>{heightDisplay}</Cell>
                <Cell>{edge.node.amount}</Cell>
                <Cell>
                  <Link
                    href={`${routes.ACCOUNT}/${router.query.fungible}/${edge.node.senderAccount}`}
                  >
                    {edge.node.senderAccount}
                  </Link>
                </Cell>
                <Cell>
                  {edge.node.receiverAccount ? (
                    <Link
                      href={`${routes.ACCOUNT}/${router.query.fungible}/${edge.node.receiverAccount}`}
                    >
                      {edge.node.receiverAccount}
                    </Link>
                  ) : edge.node.crossChainTransfer?.receiverAccount ? (
                    <Link
                      href={`${routes.ACCOUNT}/${router.query.fungible}/${edge.node.crossChainTransfer.receiverAccount}`}
                    >
                      {edge.node.crossChainTransfer.receiverAccount}
                    </Link>
                  ) : (
                    <span style={{ color: 'lightgray' }}>N/A</span>
                  )}
                </Cell>
                <Cell>
                  <Link href={`${routes.TRANSACTIONS}/${edge.node.requestKey}`}>
                    {edge.node.requestKey}
                  </Link>
                  {edge.node.crossChainTransfer && (
                    <>
                      <span> / </span>
                      <Link
                        href={`${routes.TRANSACTIONS}/${edge.node.crossChainTransfer.requestKey}`}
                      >
                        {edge.node.crossChainTransfer.requestKey}
                      </Link>
                    </>
                  )}
                </Cell>
              </Row>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
