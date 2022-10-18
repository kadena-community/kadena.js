import FileDownloadIcon from 'components/common/GlobalIcons/FileDownloadIcon';
import React, { FC, memo, useMemo } from 'react';
import { CSVLink } from 'react-csv';
import { IDataChart } from 'services/banner';

interface IProps {
  chartData: {
    domain?: number[];
    data: IDataChart[];
  };
  title: string;
  isRealTime: boolean;
}

type Keys = keyof IDataChart;

const ExportChart: FC<IProps> = ({ chartData, title, isRealTime }) => {
  const headers = useMemo(() => {
    return isRealTime ? ['Date', 'Value'] : ['Date', 'Avg', 'Max', 'Min'];
  }, [isRealTime]);
  const fileds = useMemo<Keys[]>(() => {
    return isRealTime ? ['name', 'pv'] : ['name', 'pv', 'max', 'min'];
  }, [isRealTime]);

  const csvData = useMemo(() => {
    const data: (string | number)[][] = [];
    data.push([title]);
    data.push(headers);
    chartData.data.forEach(item => {
      data.push(fileds.map(field => String(item[field])));
    });
    return data;
  }, [chartData, title, headers, fileds]);

  return (
    <CSVLink data={csvData} filename={`${title}${Date.now()}.csv`}>
      <p title="Expot to csv">
        <FileDownloadIcon height="24" width="24" fill="#8e6c93" />
      </p>
    </CSVLink>
  );
};

export default memo(ExportChart);
