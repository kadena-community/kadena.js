import { APIRoute } from 'config/Routes';
import { chainInfoAsync, nodeInfoAsync, statInfoAsync } from 'services/api';
import prisma from 'services/prisma';
import { NetworkName } from 'utils/api';

export default async function handler(req: any, res: any) {
  try {
    const { network } = req.query;

    if (
      ![NetworkName.MAIN_NETWORK, NetworkName.TEST_NETWORK].includes(network)
    ) {
      throw new Error('No network exists');
    }

    if (req.headers?.authorization !== 'kadena-architech') {
      throw new Error('No access');
    }

    const nodeInfoData = await nodeInfoAsync(APIRoute.Info, network);

    if (
      !nodeInfoData?.version ||
      !nodeInfoData?.instance ||
      !nodeInfoData?.chainIds ||
      !nodeInfoData?.height
    ) {
      throw new Error('Missing node info data');
    }

    const chainStats = await statInfoAsync(APIRoute.Stats, network);

    if (!chainStats) {
      throw new Error('Missing chain stats');
    }

    const chainInfo = await chainInfoAsync(
      APIRoute.Chain,
      network,
      nodeInfoData,
      undefined,
    );

    if (!chainInfo) {
      throw new Error('Missing chain info');
    }

    const { networkHashRate, totalDifficulty } = chainInfo;
    const { circulatingSupply, totalTransactions } = chainStats;

    const data = {
      networkHashRate,
      totalDifficulty,
      circulatingSupply: String(circulatingSupply),
      totalTransactions: String(totalTransactions),
    };

    if (network === NetworkName.MAIN_NETWORK) {
      await prisma.info.create({ data });
    } else {
      await prisma.testInfo.create({ data });
    }

    await prisma.$disconnect();
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    await prisma.$disconnect();
    res.status(500).json({ message: (error as any)?.message || 'Error' });
  }
}
