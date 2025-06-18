import { describe, expect, it, vi } from 'vitest';
import type { IAsset } from '../../../contexts/AssetContext/AssetContext';
import type { IOrganisation } from '../../../contexts/OrganisationContext/OrganisationContext';
import { AssetStore } from '../../store/assetStore';

// Mocks for dependencies
vi.mock('../store/firebase', () => ({
  database: {},
}));
vi.mock('../store', () => ({
  getAssetFolder: (asset: IAsset) =>
    `${asset.namespace}${asset.contractName}` || 'mockAssetFolder',
}));
vi.mock('firebase/database', () => ({
  ref: vi.fn((db, path) => path),
  onValue: vi.fn((ref, cb) => {
    // Simulate a snapshot with .val()
    cb({ val: () => ({ id: '1', name: 'Asset 1' }) });
  }),
  off: vi.fn(),
  set: vi.fn(async () => {}),
  get: vi.fn(async () => ({ val: () => ({ id: '1', name: 'Asset 1' }) })),
}));

describe('AssetStore', () => {
  const mockOrg: IOrganisation = {
    id: 'org1',
    name: 'Org',
    domains: [],
    sendEmail: '',
  };
  const mockAsset: IAsset = {
    uuid: 'asset1',
    contractName: 'contract',
    namespace: 'ns',
    supply: 100,
    investorCount: 10,
    compliance: {
      maxSupply: {
        key: 'supply-limit-compliance-v1',
        isActive: true,
        value: 1000,
      },
      maxBalance: {
        key: 'max-balance-compliance-v1',
        isActive: true,
        value: 100,
      },
      maxInvestors: {
        key: 'max-investors-compliance-v1',
        isActive: true,
        value: 10,
      },
    },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('throws if no organisation is provided', () => {
    expect(() => AssetStore(undefined as unknown as IOrganisation)).toThrow(
      'no organisation or user found',
    );
  });

  it('listenToAssets calls setDataCallback with assets', () => {
    const store = AssetStore(mockOrg);
    const cb = vi.fn();
    store.listenToAssets(cb);
    expect(cb).toHaveBeenCalledWith(['1', 'Asset 1']);
  });

  it('listenToAsset calls setDataCallback with asset', () => {
    const store = AssetStore(mockOrg);
    const cb = vi.fn();
    store.listenToAsset(mockAsset, cb);
    expect(cb).toHaveBeenCalledWith({ id: '1', name: 'Asset 1' });
  });

  it('addAsset calls set with correct params', async () => {
    const { addAsset } = AssetStore(mockOrg);
    const { set } = await import('firebase/database');
    await addAsset(mockAsset);
    expect(set).toHaveBeenCalledWith(
      '/organisations/org1/assets/nscontract',
      mockAsset,
    );
  });

  it('updateAsset calls addAsset', async () => {
    const { updateAsset } = AssetStore(mockOrg);
    const { set } = await import('firebase/database');
    await updateAsset(mockAsset);
    expect(set).toHaveBeenCalledWith(
      '/organisations/org1/assets/nscontract',
      mockAsset,
    );
  });

  it('removeAsset calls set with null', async () => {
    const { removeAsset } = AssetStore(mockOrg);
    const { set } = await import('firebase/database');
    await removeAsset(mockAsset);
    expect(set).toHaveBeenCalledWith(
      '/organisations/org1/assets/nscontract',
      null,
    );
  });

  it('getAsset calls get', async () => {
    const { getAsset } = AssetStore(mockOrg);
    const { get } = await import('firebase/database');
    await getAsset(mockAsset);
    expect(get).toHaveBeenCalledWith('/organisations/org1/assets/nscontract');
  });
});
