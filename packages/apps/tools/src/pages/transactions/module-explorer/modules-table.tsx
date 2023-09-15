import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { Button, Pagination, Table } from '@kadena/react-ui';

import type { IModule } from './new';

import React, { useState } from 'react';

interface IModulesTableProps {
  searchQuery: string;
  chainID: ChainwebChainId | '';
  onModuleClick: (module: IModule) => void;
  modules: IModule[];
}

const ITEMS_PER_PAGE = 10;

const ModulesTable = ({
  searchQuery,
  chainID,
  onModuleClick,
  modules,
}: IModulesTableProps) => {
  const [page, setPage] = useState<number>(1);

  const filteredModules = modules
    .filter((module) => {
      if (chainID === '') return true;

      return module.chainId === chainID;
    })
    .filter((module) => {
      if (!searchQuery) return true;

      return module.moduleName.includes(searchQuery);
    });

  const pageModules = filteredModules.length
    ? filteredModules.slice(
        (page - 1) * ITEMS_PER_PAGE,
        (page - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
      )
    : [];

  return (
    <>
      <Pagination
        totalPages={Math.ceil((filteredModules.length || 0) / ITEMS_PER_PAGE)}
        onPageChange={(pageNum) => setPage(pageNum)}
        label="label"
        visiblePageLimit={5}
      />
      <Table.Root>
        <Table.Head>
          <Table.Tr>
            <Table.Th>Chain</Table.Th>
            <Table.Th>Module name</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {pageModules.map((module) => {
            return (
              <Table.Tr key={`${module.moduleName}}-${module.chainId}`}>
                <Table.Td>{module.chainId}</Table.Td>
                <Table.Td>{module.moduleName}</Table.Td>
                <Table.Td>
                  <Button
                    icon="Eye"
                    iconAlign="left"
                    onClick={() => onModuleClick(module)}
                  >
                    View
                  </Button>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default ModulesTable;
