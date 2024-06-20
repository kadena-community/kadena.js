import type { IncompleteModuleModel } from '@/hooks/use-module-query';
import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import type { NextApiRequestCookies } from 'next/dist/server/api-utils';
import type { ParsedUrlQuery } from 'querystring';
import { describe, expect, it } from 'vitest';
import {
  getCookieValue,
  getQueryValue,
  mapToTreeItems,
  modelsToTreeMap,
} from './utils';

const exampleCookies: NextApiRequestCookies = {
  '_persist%3AdevOption': '%22BASIC%22',
  '_persist%3AchainID': '%221%22',
  '_persist%3Anetwork': '%22testnet04%22',
};

const exampleQuery: ParsedUrlQuery = {
  module: 'ab2288bca-3d56-4da0-b363-0df378b9956d.ns-module',
  chain: '0',
};

describe('getQueryValue', () => {
  it('should return undefined if the needle is not in the haystack', () => {
    expect(getQueryValue('needle', {})).toBeUndefined();
  });

  it('should be able to get an existing value from the query', () => {
    expect(getQueryValue('module', exampleQuery)).toBe(
      'ab2288bca-3d56-4da0-b363-0df378b9956d.ns-module',
    );
    expect(getQueryValue('chain', exampleQuery)).toBe('0');
  });

  it('should not be able to get an existing value from the query if the validator fails', () => {
    expect(getQueryValue('module', exampleQuery, () => false)).toBeUndefined();

    expect(getQueryValue('chain', { chain: '1337' })).toBe('1337');

    expect(
      getQueryValue('chain', { chain: '1337' }, (value) =>
        CHAINS.includes(value),
      ),
    ).toBeUndefined();
  });
});

describe('getCookieValue', () => {
  it('should return null if the needle is not in the haystack', () => {
    expect(getCookieValue('needle', {})).toBeNull();
  });

  it('should return the default value if the needle is not in the haystack', () => {
    expect(getCookieValue('needle', {}, 'my default value')).toBe(
      'my default value',
    );
  });

  it('should be able to get an existing value from the cookies', () => {
    expect(getCookieValue('chainID', exampleCookies)).not.toBe('%221%22');
    expect(getCookieValue('chainID', exampleCookies)).toBe('1');

    expect(getCookieValue('network', exampleCookies)).toBe('testnet04');
  });
});

describe('modelsToTreeMap', () => {
  it('should return an empty map if the models array is empty', () => {
    const models: IncompleteModuleModel[] = [];
    const result = modelsToTreeMap(models);
    expect(result.size).toBe(0);
  });

  it('should correctly convert a flat models array to a map', () => {
    const models: IncompleteModuleModel[] = [
      {
        name: 'namespace1.module1',
        chainId: '1',
        networkId: 'testnet04',
      },
      {
        name: 'namespace2.module2',
        chainId: '2',
        networkId: 'testnet04',
      },
      {
        name: 'coin',
        chainId: '3',
        networkId: 'mainnet01',
      },
      {
        name: 'fungible-v2',
        chainId: '19',
        networkId: 'development',
      },
    ];
    const result = modelsToTreeMap(models);
    expect(result.size).toBe(4);
    expect(result.get('namespace1')).toEqual(
      new Map(
        Object.entries({
          module1: [
            {
              name: 'namespace1.module1',
              chainId: '1',
              networkId: 'testnet04',
            },
          ],
        }),
      ),
    );
    expect(result.get('namespace2')).toEqual(
      new Map(
        Object.entries({
          module2: [
            {
              name: 'namespace2.module2',
              chainId: '2',
              networkId: 'testnet04',
            },
          ],
        }),
      ),
    );
    expect(result.get('coin')).toEqual([
      {
        name: 'coin',
        chainId: '3',
        networkId: 'mainnet01',
      },
    ]);
    expect(result.get('fungible-v2')).toEqual([
      {
        name: 'fungible-v2',
        chainId: '19',
        networkId: 'development',
      },
    ]);
  });

  it('should correctly convert a nested models array to a map', () => {
    const models: IncompleteModuleModel[] = [
      {
        name: 'namespace1.module1',
        chainId: '1',
        networkId: 'testnet04',
      },
      {
        name: 'namespace1.module2',
        chainId: '2',
        networkId: 'testnet04',
      },
      {
        name: 'namespace2.module1',
        chainId: '3',
        networkId: 'testnet04',
      },
      {
        name: 'coin',
        chainId: '0',
        networkId: 'testnet04',
      },
    ];
    const result = modelsToTreeMap(models);
    expect(result.size).toBe(3);
    expect(result.get('namespace1')).toBeInstanceOf(Map);
    expect(result.get('namespace2')).toBeInstanceOf(Map);
    expect(result.get('coin')).toBeInstanceOf(Array);

    const namespace1Map = result.get('namespace1') as Map<
      string,
      IncompleteModuleModel[]
    >;
    expect(namespace1Map.size).toBe(2);
    expect(namespace1Map.get('module1')).toEqual([
      {
        name: 'namespace1.module1',
        chainId: '1',
        networkId: 'testnet04',
      },
    ]);
    expect(namespace1Map.get('module2')).toEqual([
      {
        name: 'namespace1.module2',
        chainId: '2',
        networkId: 'testnet04',
      },
    ]);

    const namespace2Map = result.get('namespace2') as Map<
      string,
      IncompleteModuleModel[]
    >;
    expect(namespace2Map.size).toBe(1);
    expect(namespace2Map.get('module1')).toEqual([
      {
        name: 'namespace2.module1',
        chainId: '3',
        networkId: 'testnet04',
      },
    ]);

    const coinArray = result.get('coin') as IncompleteModuleModel[];
    expect(coinArray.length).toBe(1);
    expect(coinArray[0]).toEqual({
      name: 'coin',
      chainId: '0',
      networkId: 'testnet04',
    });
  });
});

describe('mapToTreeItems', () => {
  it('should return an empty array if the modulesMap is empty', () => {
    const modulesMap = new Map();
    const result = mapToTreeItems(modulesMap);
    expect(result).toEqual([]);
  });

  it('should correctly convert a flat modulesMap to tree items', () => {
    const modulesMap = new Map([
      [
        'coin',
        [
          {
            name: 'coin',
            chainId: '1' as ChainwebChainId,
            networkId: 'testnet04' as ChainwebNetworkId,
          },
        ],
      ],
    ]);

    const result = mapToTreeItems(modulesMap);
    expect(result).toEqual([
      {
        data: {
          name: 'coin',
          chainId: '1',
          networkId: 'testnet04',
        },
        key: 'coin',
        title: 'coin',
        isActive: false,
        children: [
          {
            data: {
              name: 'coin',
              chainId: '1' as ChainwebChainId,
              networkId: 'testnet04' as ChainwebNetworkId,
            },
            key: 'coin.1',
            title: '1',
            children: [],
            label: undefined,
            isActive: false,
          },
        ],
      },
    ]);
  });

  it('should correctly convert a nested modulesMap to tree items', () => {
    const modulesMap = new Map([
      [
        'namespace1',
        new Map([
          [
            'module1',
            [
              {
                name: 'namespace1.module1',
                chainId: '1' as ChainwebChainId,
                networkId: 'testnet04' as ChainwebNetworkId,
              },
            ],
          ],
        ]),
      ],
    ]);

    const result = mapToTreeItems(modulesMap);
    expect(result).toEqual([
      {
        data: {
          name: 'namespace1.module1',
          chainId: '1',
          networkId: 'testnet04',
        },
        key: 'namespace1',
        title: 'namespace1',
        isActive: false,
        children: [
          {
            data: {
              name: 'namespace1.module1',
              chainId: '1',
              networkId: 'testnet04',
            },
            key: 'namespace1.module1',
            title: 'module1',
            isActive: false,
            children: [
              {
                data: {
                  name: 'namespace1.module1',
                  chainId: '1',
                  networkId: 'testnet04',
                },
                key: 'namespace1.module1.1',
                title: '1',
                children: [],
                label: undefined,
                isActive: false,
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should correctly accept an additional (parent) "prefix" key', () => {
    const modulesMap = new Map([
      [
        'coin',
        [
          {
            name: 'coin',
            chainId: '1' as ChainwebChainId,
            networkId: 'testnet04' as ChainwebNetworkId,
          },
        ],
      ],
    ]);

    const result = mapToTreeItems(modulesMap, undefined, 'some-parent-key');
    expect(result).toEqual([
      {
        data: {
          name: 'coin',
          chainId: '1',
          networkId: 'testnet04',
        },
        key: 'some-parent-key.coin',
        title: 'coin',
        isActive: false,
        children: [
          {
            data: {
              name: 'coin',
              chainId: '1' as ChainwebChainId,
              networkId: 'testnet04' as ChainwebNetworkId,
            },
            isActive: false,
            key: 'some-parent-key.coin.1',
            title: '1',
            children: [],
            label: undefined,
          },
        ],
      },
    ]);
  });
});
