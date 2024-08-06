import type { NetworkInfoQuery } from '@/__generated__/sdk';
import type { INetwork } from '@/constants/network';
import { defaultNamingOfNetwork } from '../defaultNamingOfNetwork';

describe('defaultNamingOfNetwork', () => {
  const networks: INetwork[] = [
    {
      networkId: 'greyskull',
      label: 'He-man',
      slug: 'he-man',
    },
    {
      networkId: 'greyskull',
      label: 'Skeletor',
      slug: 'skeletor',
    },
    {
      networkId: 'greyskull',
      label: 'Skeletor-1',
      slug: 'skeletor-1',
    },
  ] as INetwork[];

  it('should create the names of the network with the given names if the name is not yet in the existing networks array', () => {
    const newNetwork = {
      networkId: 'greyskull',
      label: 'Cringer',
      slug: 'cringer',
    } as INetwork;

    const networkInfo = {
      networkInfo: {
        networkId: 'Cringer',
      },
    } as NetworkInfoQuery;

    const result = defaultNamingOfNetwork(newNetwork, networkInfo, networks);
    const expectedResult = {
      ...newNetwork,
      networkId: networkInfo.networkInfo?.networkId,
      slug: 'cringer',
      label: 'Cringer',
    };

    expect(result).toEqual(expectedResult);
  });

  it('should create the names of the network with "-1", name exists in existing networks', () => {
    const newNetwork = {
      networkId: 'greyskull',
      label: 'Cringer',
      slug: 'cringer',
    } as INetwork;

    const networkInfo = {
      networkInfo: {
        networkId: 'He-man',
      },
    } as NetworkInfoQuery;

    const result = defaultNamingOfNetwork(newNetwork, networkInfo, networks);
    const expectedResult = {
      ...newNetwork,
      networkId: networkInfo.networkInfo?.networkId,
      slug: 'he-man-1',
      label: 'He-man-1',
    };

    expect(result).toEqual(expectedResult);
  });

  it('should create the names of the network with "-2", name exists in existing networks', () => {
    const newNetwork = {
      networkId: 'greyskull',
      label: 'Cringer',
      slug: 'cringer',
    } as INetwork;

    const networkInfo = {
      networkInfo: {
        networkId: 'skeletor',
      },
    } as NetworkInfoQuery;

    const result = defaultNamingOfNetwork(newNetwork, networkInfo, networks);
    const expectedResult = {
      ...newNetwork,
      networkId: networkInfo.networkInfo?.networkId,
      slug: 'skeletor-2',
      label: 'skeletor-2',
    };

    expect(result).toEqual(expectedResult);
  });

  it('should create the name when there is no networkId', () => {
    const newNetwork = {
      networkId: 'greyskull',
      label: 'Cringer',
      slug: 'cringer',
    } as INetwork;

    const networkInfo = {
      networkInfo: {},
    } as NetworkInfoQuery;

    const result = defaultNamingOfNetwork(newNetwork, networkInfo, networks);
    const expectedResult = {
      ...newNetwork,
      networkId: '',
      slug: '-3',
      label: '-3',
    };

    expect(result).toEqual(expectedResult);
  });
});
