import type { NextRequest } from 'next/server';
import { beforeEach, expect, vi } from 'vitest';
import { DELETE, POST } from '../route';

const createMockRequest = (
  body: any,
  url = 'http://localhost/api?organisationId=org1&uid=uid1',
) => {
  return {
    json: async () => body,
    url,
    headers: new Map([['authorization', 'Bearer mock-token']]),
  } as unknown as NextRequest;
};

const mocks = vi.hoisted(() => ({
  mockSetCustomUserClaims: vi.fn(),
  mockGetUserByEmail: vi.fn(),
  mockCreateUser: vi.fn(),
  mockGetUser: vi.fn(),
  mockVerifyIdToken: vi.fn(),
  mockGetDBRef: vi.fn(() => ({ set: vi.fn(), remove: vi.fn() })),
}));

describe('claims API', () => {
  beforeEach(() => {
    vi.mock('./../../app', () => ({
      adminAuth: () => ({
        setCustomUserClaims: mocks.mockSetCustomUserClaims,
        getUserByEmail: mocks.mockGetUserByEmail,
        createUser: mocks.mockCreateUser,
        getUser: mocks.mockGetUser,
        verifyIdToken: mocks.mockVerifyIdToken,
      }),
      getDB: () => ({ ref: mocks.mockGetDBRef }),
      getTokenId: vi.fn(() => 'mock-token'),
    }));

    // withOrgAdmin just calls the handler directly in tests
    vi.mock('./../../../withAuth', () => ({
      withOrgAdmin: (handler: any) => handler,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should add claims for an existing user', async () => {
      const organisationId = 'org1';
      const user = { uid: 'uid1', customClaims: {} };
      mocks.mockGetUserByEmail.mockResolvedValueOnce(user);
      const req = createMockRequest({
        email: 'test@example.com',
        organisationId,
      });
      const res = await POST(req);
      expect(mocks.mockGetUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mocks.mockSetCustomUserClaims).toHaveBeenCalledWith('uid1', {
        orgAdmins: {
          [organisationId]: true,
        },
      });
      expect(mocks.mockCreateUser).not.toHaveBeenCalled();
      expect(res.status).toBe(200);
    });

    it('should create a user if not found and add claims', async () => {
      const organisationId = 'org2';
      mocks.mockGetUserByEmail.mockRejectedValueOnce(new Error('not found'));
      mocks.mockCreateUser.mockResolvedValueOnce({ uid: 'uid2' });
      const user = { uid: 'uid2', customClaims: {} };
      mocks.mockGetUserByEmail.mockResolvedValueOnce(user);
      const req = createMockRequest({
        email: 'new@example.com',
        organisationId,
      });
      const res = await POST(req);
      expect(mocks.mockCreateUser).toHaveBeenCalledWith({
        email: 'new@example.com',
        emailVerified: false,
        password: expect.any(String),
        displayName: '-',
      });
      expect(mocks.mockSetCustomUserClaims).toHaveBeenCalledWith('uid2', {
        orgAdmins: {
          [organisationId]: true,
        },
      });
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE', () => {
    it('should remove claims for a user', async () => {
      mocks.mockVerifyIdToken.mockResolvedValueOnce({ uid: 'admin' });
      const user = { uid: 'uid3', customClaims: {} };
      mocks.mockGetUser.mockResolvedValueOnce(user);
      const req = {
        url: 'http://localhost/api?organisationId=org3&uid=uid3',
        headers: new Map([['authorization', 'Bearer mock-token']]),
      } as unknown as NextRequest;
      const res = await DELETE(req);
      expect(mocks.mockGetUser).toHaveBeenCalledWith('uid3');
      expect(mocks.mockSetCustomUserClaims).toHaveBeenCalledWith(
        'uid3',
        expect.any(Object),
      );
      expect(res.status).toBe(200);
    });

    it('should not allow a user to delete themselves as admin', async () => {
      mocks.mockVerifyIdToken.mockResolvedValueOnce({ uid: 'uid4' });
      const user = { uid: 'uid4', customClaims: {} };
      mocks.mockGetUser.mockResolvedValueOnce(user);
      const req = {
        url: 'http://localhost/api?organisationId=org4&uid=uid4',
        headers: new Map([['authorization', 'Bearer mock-token']]),
      } as unknown as NextRequest;
      const res = await DELETE(req);
      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.message).toMatch(/delete your self as an admin/);
    });
  });
});
