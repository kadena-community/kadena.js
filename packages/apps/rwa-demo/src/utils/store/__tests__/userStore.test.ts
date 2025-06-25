import type { User } from 'firebase/auth';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WALLETTYPES } from '../../../constants';
import type { IOrganisation } from '../../../contexts/OrganisationContext/OrganisationContext';
import type { IWalletAccount } from '../../../providers/AccountProvider/AccountType';
import { UserStore } from '../../store/userStore';

// Minimal valid IWalletAccount mock
const mockAccount: IWalletAccount = {
  address: 'acc1',
  publicKey: 'pk',
  guard: { keys: ['pk'], pred: 'keys-all' },
  keyset: { keys: ['pk'], pred: 'keys-all' },
  alias: 'alias',
  contract: 'contract',
  chains: [{ chainId: '0', balance: '0' }],
  overallBalance: '0',
  walletName: WALLETTYPES.CHAINWEAVER,
  walletType: 'default',
};

// Mocks for dependencies
vi.mock('../store/firebase', () => ({
  database: {},
}));
vi.mock('firebase/database', () => ({
  ref: vi.fn((db, path) => path),
  onValue: vi.fn((ref, cb) => {
    cb({
      val: () => ({
        accounts: { acc1: mockAccount },
        data: { displayName: 'Test User' },
      }),
      key: 'user1',
    });
  }),
  off: vi.fn(),
  set: vi.fn(async () => {}),
  get: vi.fn(async () => ({ val: () => ({ acc1: mockAccount }) })),
}));

describe('UserStore', () => {
  const mockOrg: IOrganisation = {
    id: 'org1',
    name: 'Org',
    domains: [],
    sendEmail: '',
  };
  const mockUser: User = {
    uid: 'user1',
  } as User;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('throws if no organisation or user is provided', () => {
    expect(() =>
      UserStore(undefined as unknown as IOrganisation, mockUser),
    ).toThrow('no organisation or user found');
    expect(() => UserStore(mockOrg, undefined as unknown as User)).toThrow(
      'no organisation or user found',
    );
  });

  it('listenToUser calls setDataCallback with user data', () => {
    const store = UserStore(mockOrg, mockUser);
    const cb = vi.fn();
    store.listenToUser(cb);
    expect(cb).toHaveBeenCalledWith({
      uid: 'user1',
      accounts: [mockAccount],
      data: { displayName: 'Test User' },
    });
  });

  it('addAccountAddress calls set with correct params', async () => {
    const { addAccountAddress } = UserStore(mockOrg, mockUser);
    const { set } = await import('firebase/database');
    await addAccountAddress(mockAccount);
    expect(set).toHaveBeenCalledWith(
      '/organisations/org1/users/user1/accounts',
      { acc1: mockAccount },
    );
  });

  it('removeAccountAddress calls set with correct params', async () => {
    const { removeAccountAddress } = UserStore(mockOrg, mockUser);
    const { set } = await import('firebase/database');
    await removeAccountAddress('acc1');
    expect(set).toHaveBeenCalledWith(
      '/organisations/org1/users/user1/accounts',
      {},
    );
  });

  it('changeProfile calls set with correct params', async () => {
    const { changeProfile } = UserStore(mockOrg, mockUser);
    const { set } = await import('firebase/database');
    await changeProfile('user1', { displayName: 'Test User' });
    expect(set).toHaveBeenCalledWith('/organisations/org1/users/user1/data', {
      displayName: 'Test User',
    });
    expect(set).toHaveBeenCalledWith('/organisationsUsers/org1/user1', {
      displayName: 'Test User',
    });
  });

  it('addAccountAlias calls set with correct params', async () => {
    const { addAccountAlias } = UserStore(mockOrg, mockUser);
    const { set } = await import('firebase/database');
    await addAccountAlias('acc1', 'alias1');
    expect(set).toHaveBeenCalledWith(
      '/organisations/org1/users/user1/aliases/acc1',
      { alias: 'alias1' },
    );
  });
});
