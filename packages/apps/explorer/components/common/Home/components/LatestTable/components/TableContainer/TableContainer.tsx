import React, { FC, memo, useCallback } from 'react';
import { Data } from 'services/latestTable';
import Link from 'next/link';
import CheckIcon from '../../../../../GlobalIcons/CheckIcon';
import s from './TableContainer.module.css';
import CloseIcon from '../../../../../GlobalIcons/CloseIcon';
import { Route } from '../../../../../../../config/Routes';

export interface ITableProps {
  data: Data[];
  onTablePopover: (id: number, datum: Data) => void;
  activeTab?: string;
  mode: string;
}

const TableContainer: FC<ITableProps> = ({
  data,
  onTablePopover,
  activeTab,
  mode,
}) => {
  const getBaseUrl = useCallback((chainId: number) => {
    if (mode === 'block') {
      return `${Route.Chain}/${chainId}${Route.Block}`;
    }
    return Route.Transaction;
  }, []);

  return (
    <table cellSpacing={0} className={s.tableContainer}>
      <thead>
        <tr className={s.tableContainerHeadRow}>
          <th>TIME</th>
          <th>CHAIN</th>
          <th>HEIGHT</th>
          <th className={s.keyHead}>
            {activeTab === 'transaction' ? 'REQUEST KEY' : 'HASH'}
          </th>
          <th
            className={
              activeTab === 'transaction' ? s.commentHead : s.commentBlockHead
            }>
            {activeTab === 'transaction' ? 'PREVIEW' : 'PARENT'}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((datum, index) => {
          const dataItemUrl = `${getBaseUrl(datum.chain)}/${datum.link}`;
          return (
            <tr
              key={index + datum.id}
              className={s.tableContainerBodyRow}
              onClick={() => onTablePopover(datum.id, datum)}>
              <td className={s.timeRow}>
                {activeTab === 'transaction' && datum.status !== undefined ? (
                  datum.status ? (
                    <CheckIcon height="12" width="12" fill="#C0FB50" />
                  ) : (
                    <CloseIcon height="12" width="12" fill="#db2828" />
                  )
                ) : null}
                <Link href={dataItemUrl} scroll={false}>
                  <a href={dataItemUrl} className={s.tableItem}>
                    {datum.time}
                  </a>
                </Link>
              </td>
              <td>
                <Link href={dataItemUrl} scroll={false}>
                  <a href={dataItemUrl} className={s.tableItem}>
                    {datum.chain}
                  </a>
                </Link>
              </td>
              <td>
                <Link href={dataItemUrl} scroll={false}>
                  <a href={dataItemUrl} className={s.tableItem}>
                    {datum.height}
                  </a>
                </Link>
              </td>
              <td className={s.keyRow}>
                <Link href={dataItemUrl} scroll={false}>
                  <a href={dataItemUrl} className={s.tableItem}>
                    {datum.key}
                  </a>
                </Link>
              </td>
              <td
                className={
                  activeTab === 'transaction' ? s.commentRow : s.commentBlockRow
                }>
                <div className={s.tableItemNoEffect}>{datum.comment}</div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default memo(TableContainer);
