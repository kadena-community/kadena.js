import { UserContext } from '@/contexts/UserContext/UserContext';
import { renderHook } from '@testing-library/react-hooks';
import { useContext } from 'react';
import { useUser } from '../user';

const mocks = vi.hoisted(() => ({
  useContext: vi.fn(),
  signInByGoogleMock: vi.fn(),
  signInByEmailMock: vi.fn(),
  signOutMock: vi.fn(),
  addAccountMock: vi.fn(),
  removeAccountMock: vi.fn(),
  findAliasByAddressMock: vi.fn().mockReturnValue('test-alias'),
}));

const mockContext = vi.hoisted(() => ({
  isMounted: true,
  signInByGoogle: mocks.signInByGoogleMock,
  signInByEmail: mocks.signInByEmailMock,
  signOut: mocks.signOutMock,
  addAccount: mocks.addAccountMock,
  removeAccount: mocks.removeAccountMock,
  findAliasByAddress: mocks.findAliasByAddressMock,
}));

describe('useUser', () => {
  beforeEach(() => {
    // Mock React's useContext
    vi.mock('react', async () => {
      const actual = await vi.importActual('react');
      return {
        ...actual,
        useContext: mocks.useContext,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error when used outside of UserContextProvider', async () => {
    // Set useContext to return null to simulate being outside the provider
    vi.mocked(mocks.useContext).mockReturnValueOnce(null);

    // The function should throw an error
    expect(() => {
      const { result } = renderHook(() => useUser());
      return result.current;
    }).toThrow('useUser must be used within a UserContextProvider');

    // Verify useContext was called with UserContext
    expect(useContext).toHaveBeenCalledWith(UserContext);
  });

  it('should provide access to all user context properties', () => {
    // Create a mock user
    const mockUser = {
      uid: 'test-uid',
      displayName: 'Test User',
      email: 'test@example.com',
    };

    const mockUserData = {
      accounts: [
        {
          address: 'k:test123',
          publicKey: 'test-public-key',
          chainId: '1',
          networkId: 'testnet04',
        },
      ],
      uid: 'test-uid',
      data: {
        displayName: 'Test User',
      },
      aliases: {
        'k:test123': { alias: 'test-alias' },
      },
    };

    // Setup context with user data
    const contextWithUser = {
      ...mockContext,
      user: mockUser,
      userData: mockUserData,
      userToken: {
        claims: {},
        expirationTime: '',
        issuedAtTime: '',
        signInProvider: '',
        token: '',
      },
    };

    vi.mocked(mocks.useContext).mockReturnValueOnce(
      contextWithUser as unknown as ReturnType<typeof useUser>,
    );

    const { result } = renderHook(() => useUser());

    // Verify properties
    expect(result.current.user).toBe(mockUser);
    expect(result.current.userData).toBe(mockUserData);
    expect(result.current.isMounted).toBe(true);

    // Verify methods
    expect(typeof result.current.signInByGoogle).toBe('function');
    expect(typeof result.current.signInByEmail).toBe('function');
    expect(typeof result.current.signOut).toBe('function');
    expect(typeof result.current.addAccount).toBe('function');
    expect(typeof result.current.removeAccount).toBe('function');
    expect(typeof result.current.findAliasByAddress).toBe('function');
  });
});
