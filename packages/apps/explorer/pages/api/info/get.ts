import groupBy from 'lodash/groupBy';
import prisma from 'services/prisma';
import { NetworkName, TimeInterval } from 'utils/api';
import BigNumber from 'bignumber.js';
import { Info } from '@prisma/client';

type FieldType =
  | 'circulatingSupply'
  | 'networkHashRate'
  | 'totalDifficulty'
  | 'totalTransactions';

interface ICalcInfo {
  avg: string;
  max: string;
  min: string;
  time: string;
}

interface IValueInfo {
  circulatingSupply: ICalcInfo;
  networkHashRate: ICalcInfo;
  totalDifficulty: ICalcInfo;
  totalTransactions: ICalcInfo;
}

export default async function handler(req: any, res: any) {
  const { network, time } = req.query;

  if (![NetworkName.MAIN_NETWORK, NetworkName.TEST_NETWORK].includes(network)) {
    res.status(500).json({ message: 'No network exists' });
  }

  if (
    ![
      TimeInterval.MONTH,
      TimeInterval.TRHEE_MONTHS,
      TimeInterval.YEAR,
    ].includes(time)
  ) {
    return res.status(200).json({ info: [] });
  }

  const date = getDateByTimeInterval(time);

  const condition = {
    where: {
      creationTime: {
        gte: date,
      },
    },
  };

  const response =
    NetworkName.MAIN_NETWORK === network
      ? await prisma.info.findMany(condition)
      : await prisma.testInfo.findMany(condition);

  const grouped = groupBy(response, item => {
    const now = new Date(item.creationTime);
    const dateUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    return dateUTC.toLocaleDateString('en-US');
  });

  const data: IValueInfo[] = [];

  const keys = Object.keys(grouped);

  const fields: FieldType[] = [
    'circulatingSupply',
    'networkHashRate',
    'totalDifficulty',
    'totalTransactions',
  ];

  keys.forEach(key => {
    const dataByDay = grouped[key];
    const dataReduce = dataByDay.reduce(
      (obj, item) => {
        return fields.reduce((prevValue, field) => {
          return {
            ...prevValue,
            [field]: getValueCalc(obj[field], item[field]),
          };
        }, {}) as IValueInfo;
      },
      fields.reduce((prevValue, field) => {
        return {
          ...prevValue,
          [field]: getValueInit(dataByDay, field, key),
        };
      }, {}) as IValueInfo,
    );
    fields.forEach(filed => {
      dataReduce[filed].avg = getValueAvg(
        dataReduce[filed].avg,
        dataByDay.length,
      );
    });
    data.push(dataReduce);
  });

  res.status(200).json({ info: data });
}

function getValueCalc(n1: ICalcInfo, n2: string) {
  return {
    avg: new BigNumber(n1.avg).plus(n2).toString(),
    max: new BigNumber(n1.max).comparedTo(n2) === 1 ? n1.max : n2,
    min: new BigNumber(n1.min).comparedTo(n2) === -1 ? n1.min : n2,
    time: n1.time,
  };
}

function getValueInit(dataByDay: Info[], field: FieldType, time: string) {
  return {
    avg: '0',
    max: '0',
    min: dataByDay.length ? dataByDay[0][field] : '0',
    time,
  };
}

function getValueAvg(n1: string, n2: number) {
  return new BigNumber(n1).dividedBy(n2).toString();
}

function getDateByTimeInterval(time: TimeInterval) {
  const now = new Date();
  const date = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  switch (time) {
    case TimeInterval.MONTH:
      date.setDate(1);
      return date;
    case TimeInterval.TRHEE_MONTHS:
      date.setMonth(date.getMonth() - 2);
      date.setDate(1);
      return date;
    case TimeInterval.YEAR:
      date.setMonth(0);
      date.setDate(1);
      return date;
    default:
      return undefined;
  }
}
