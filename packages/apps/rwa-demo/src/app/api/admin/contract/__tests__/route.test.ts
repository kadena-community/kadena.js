import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../route';

const createMockRequest = (
  body: any,
  url = 'http://localhost/api/contract?organisationId=org1',
) => {
  return {
    json: async () => body,
    url,
    headers: new Map([['authorization', 'Bearer mock-token']]),
  } as unknown as NextRequest;
};

const mocks = vi.hoisted(() => ({
  mockVerifyIdToken: vi.fn(),
  mockGetDBRef: vi.fn(() => ({ once: vi.fn() })),
  mockSnapshot: { toJSON: vi.fn() },
  mockCreateContract: vi.fn(),
  mockObjectsToArrayAccount: vi.fn(),
}));

describe('contract API', () => {
  beforeEach(() => {
    vi.mock('./../../app', () => ({
      adminAuth: () => ({ verifyIdToken: mocks.mockVerifyIdToken }),
      getDB: () => ({ ref: mocks.mockGetDBRef }),
      getTokenId: vi.fn(() => 'mock-token'),
    }));
    vi.mock('@/services/createContract', () => ({
      createContract: mocks.mockCreateContract,
    }));
    vi.mock('@/utils/objectsToArrayAccount', () => ({
      objectsToArrayAccount: mocks.mockObjectsToArrayAccount,
    }));
    mocks.mockVerifyIdToken.mockReset();
    mocks.mockGetDBRef.mockReset();
    mocks.mockCreateContract.mockReset();
    mocks.mockObjectsToArrayAccount.mockReset();
    mocks.mockSnapshot.toJSON.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if data, organisationId, or accountAddress is missing', async () => {
    const req = createMockRequest({}, 'http://localhost/api/contract');
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 401 if user is not authenticated', async () => {
    mocks.mockVerifyIdToken.mockResolvedValueOnce(null);
    const req = createMockRequest(
      { accountAddress: 'acc1', foo: 'bar' },
      'http://localhost/api/contract?organisationId=org1',
    );
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 401 if account is not found', async () => {
    mocks.mockVerifyIdToken.mockResolvedValueOnce({ uid: 'user1' });
    const ref = {
      once: vi.fn().mockResolvedValue({ toJSON: () => ({ accounts: {} }) }),
    };
    mocks.mockGetDBRef.mockReturnValue(ref);
    const req = createMockRequest(
      { accountAddress: 'acc1', foo: 'bar' },
      'http://localhost/api/contract?organisationId=org1',
    );
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 401 if data or accountAddress is missing', async () => {
    mocks.mockVerifyIdToken.mockResolvedValue({
      uid: 'user1',
      orgAdmins: { org1: true },
    });
    // Missing accountAddress
    let req = createMockRequest(
      { foo: 'bar' },
      'http://localhost/api/contract?organisationId=org1',
    );
    let res = await POST(req);
    expect(res.status).toBe(401);
    // Missing data (empty body)
    req = createMockRequest(
      {},
      'http://localhost/api/contract?organisationId=org1',
    );
    res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 200 and contract tx if contract is created successfully', async () => {
    mocks.mockVerifyIdToken.mockResolvedValue({
      uid: 'user1',
      orgAdmins: { org1: true },
    });
    const userData = {
      accounts: {
        acc1: { address: 'acc1', foo: 'bar' },
      },
    };
    const ref = { once: vi.fn().mockResolvedValue({ toJSON: () => userData }) };
    mocks.mockGetDBRef.mockReturnValue(ref);
    mocks.mockObjectsToArrayAccount.mockReturnValue([
      { address: 'acc1', foo: 'bar' },
    ]);
    mocks.mockCreateContract.mockResolvedValueOnce('mock-tx');
    const req = createMockRequest(
      { accountAddress: 'acc1', foo: 'bar' },
      'http://localhost/api/contract?organisationId=org1',
    );

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.tx).toBe('mock-tx');
  });

  it('should return 500 if createContract throws', async () => {
    mocks.mockVerifyIdToken.mockResolvedValue({
      uid: 'user1',
      orgAdmins: { org1: true },
    });
    const userData = {
      accounts: {
        acc1: { address: 'acc1', foo: 'bar' },
      },
    };
    const ref = { once: vi.fn().mockResolvedValue({ toJSON: () => userData }) };
    mocks.mockGetDBRef.mockReturnValue(ref);
    mocks.mockObjectsToArrayAccount.mockReturnValue([
      { address: 'acc1', foo: 'bar' },
    ]);
    mocks.mockCreateContract.mockRejectedValueOnce(new Error('fail'));
    const req = createMockRequest(
      { accountAddress: 'acc1', foo: 'bar' },
      'http://localhost/api/contract?organisationId=org1',
    );
    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('fail');
  });

  it('should return 500 if account is not found for the user', async () => {
    mocks.mockVerifyIdToken.mockResolvedValue({
      uid: 'user1',
      orgAdmins: { org1: true },
    });
    const userData = {
      accounts: {
        acc2: { address: 'acc2', foo: 'bar' }, // different account
      },
    };
    const ref = { once: vi.fn().mockResolvedValue({ toJSON: () => userData }) };
    mocks.mockGetDBRef.mockReturnValue(ref);
    mocks.mockObjectsToArrayAccount.mockReturnValue([]);
    const req = createMockRequest(
      { accountAddress: 'acc1', foo: 'bar' },
      'http://localhost/api/contract?organisationId=org1',
    );
    const res = await POST(req);
    expect(res.status).toBe(500);
    const text = await res.text();
    expect(text).toBe('The account is not found on this user');
  });
});
