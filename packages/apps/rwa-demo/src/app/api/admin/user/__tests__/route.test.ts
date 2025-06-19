import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as appModule from '../../app';
import { DELETE, GET, POST } from '../route';

const mocks = vi.hoisted(() => ({
  adminAuth: vi.fn(),
  getDB: vi.fn(),
  getTokenId: vi.fn(),
  sendVerificationMail: vi.fn(),
}));

describe('admin user API routes', () => {
  let mockAdminAuth: ReturnType<typeof vi.fn>;
  let mockGetDB: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.mock('@/utils/sendVerificationMail', () => ({
      sendVerificationMail: mocks.sendVerificationMail,
    }));

    vi.mock('../../app', () => ({
      adminAuth: mocks.adminAuth,
      getDB: mocks.getDB,
      getTokenId: mocks.getTokenId,
    }));

    mockAdminAuth = appModule.adminAuth as unknown as ReturnType<typeof vi.fn>;
    mockGetDB = appModule.getDB as unknown as ReturnType<typeof vi.fn>;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    beforeEach(() => {
      // Mock token ID
      mocks.getTokenId.mockReturnValue('mock-token-id');

      mockAdminAuth.mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: 'current-user-id',
          orgAdmins: { org1: true },
        }),
        getUser: vi
          .fn()
          .mockResolvedValue({ uid: 'user-to-delete', customClaims: {} }),
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });
    it('should return 404 if no uid is provided', async () => {
      const req = {
        url: 'http://localhost/api/admin/user?organisationId=org1',
      } as NextRequest;
      const res = await GET(req);
      expect(res.status).toBe(404);
    });

    it('should return 403 if user is not a root admin', async () => {
      // Setup user without rootAdmin claim
      mockAdminAuth.mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: 'current-user-id',
          orgAdmins: { org1: true },
        }),
        getUser: vi.fn().mockResolvedValue({
          uid: 'test-user-id',
          customClaims: {
            // No rootAdmin claim here
          },
        }),
      });

      const req = {
        url: 'http://localhost/api/admin/user?uid=test-user-id&organisationId=org1',
      } as NextRequest;

      const res = await GET(req);

      expect(res.status).toBe(403);
      const text = await res.text();
      expect(text).toContain('test-user-id: not an admin for org1');
    });

    it('should return 403 if user is not an admin for the specified organisation', async () => {
      // Setup user without orgAdmins claim for org1
      mockAdminAuth.mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: 'current-user-id',
          orgAdmins: { org1: true },
        }),
        getUser: vi.fn().mockResolvedValue({
          uid: 'test-user-id',
          customClaims: {
            // Missing or incorrect orgAdmins claim
            orgAdmins: { org2: true }, // Has access to org2, but not org1
          },
        }),
      });

      const req = {
        url: 'http://localhost/api/admin/user?uid=test-user-id&organisationId=org1',
      } as NextRequest;

      const res = await GET(req);

      expect(res.status).toBe(403);
      const text = await res.text();
      expect(text).toContain('not an admin for org1');
    });

    it('should successfully return user info when user is properly authorized', async () => {
      // Setup user with correct orgAdmins claim
      mockAdminAuth.mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: 'current-user-id',
          orgAdmins: { org1: true },
        }),
        getUser: vi.fn().mockResolvedValue({
          uid: 'test-user-id',
          email: 'test@example.com',
          customClaims: {
            orgAdmins: { org1: true }, // Has correct access to org1
          },
        }),
      });

      const req = {
        url: 'http://localhost/api/admin/user?uid=test-user-id&organisationId=org1',
      } as NextRequest;

      const res = await GET(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({
        uid: 'test-user-id',
        email: 'test@example.com',
      });
    });
  });

  describe('POST', () => {
    it('should create a user if not found and send verification mail', async () => {
      mocks.getTokenId.mockReturnValue('mock-token-id');
      // Mock adminAuth and DB
      mockAdminAuth.mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: 'newuid',
          orgAdmins: { org1: true },
        }),
        getUserByEmail: vi.fn().mockResolvedValueOnce('').mockResolvedValue({
          uid: 'newuid',
          email: 'he-man@mastersoftheuniverse.com',
        }),
        createUser: vi.fn().mockResolvedValue({
          uid: 'newuid',
          email: 'he-man@mastersoftheuniverse.com',
        }),
        getUser: vi.fn().mockResolvedValue({
          uid: 'newuid',
          email: 'he-man@mastersoftheuniverse.com',
          customClaims: {},
        }),
        generateEmailVerificationLink: vi
          .fn()
          .mockResolvedValue('http://verify'),
        setCustomUserClaims: vi.fn(),
      });
      mockGetDB.mockReturnValue({
        ref: vi.fn().mockReturnThis(),
        set: vi.fn().mockResolvedValue(undefined),
      });
      const req = {
        url: 'http://localhost/api/admin/user?organisationId=org1',
        json: async () => ({
          email: 'skeletor@mastersoftheuniverse.com',
          organisationId: 'org1',
        }),
      } as unknown as NextRequest;
      const res = await POST(req);
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE', () => {
    it('should return 500 if no uid is provided', async () => {
      // Mock token ID
      mocks.getTokenId.mockReturnValue('mock-token-id');

      mockAdminAuth.mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: 'current-user-id',
          orgAdmins: { org1: true },
        }),
        getUser: vi
          .fn()
          .mockResolvedValue({ uid: 'user-to-delete', customClaims: {} }),
      });

      const req = {
        url: 'http://localhost/api/admin/user?organisationId=org1',
      } as NextRequest;
      const res = await DELETE(req);
      expect(res.status).toBe(500);
    });

    it('should successfully delete a user', async () => {
      // Mock token ID
      mocks.getTokenId.mockReturnValue('mock-token-id');

      // Set up DB mock
      mockGetDB.mockReturnValue({
        ref: vi.fn().mockReturnThis(),
        remove: vi.fn().mockResolvedValue(undefined),
      });

      // Set up auth mock with different UIDs to avoid self-delete error
      mockAdminAuth.mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: 'current-admin-id',
          orgAdmins: { org1: true },
        }),
        getUser: vi.fn().mockResolvedValue({
          uid: 'user-to-delete',
          customClaims: { allowedOrgs: { org1: true } },
        }),
      });

      const req = {
        url: 'http://localhost/api/admin/user?organisationId=org1&uid=user-to-delete',
      } as NextRequest;
      const res = await DELETE(req);
      expect(res.status).toBe(200);

      // Verify response contains the deleted UID
      const responseData = await res.json();
      expect(responseData).toEqual({ uid: 'user-to-delete' });
    });

    it('should return 400 if user tries to delete themselves', async () => {
      // Mock token ID
      mocks.getTokenId.mockReturnValue('mock-token-id');

      // This is the key part: set up the same UID for both the current user and the user to delete
      const sameUid = 'admin-user-id';

      mockAdminAuth.mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: sameUid,
          orgAdmins: { org1: true },
        }),
        getUser: vi.fn().mockResolvedValue({
          uid: sameUid,
          customClaims: { allowedOrgs: { org1: true } },
        }),
      });

      const req = {
        url: `http://localhost/api/admin/user?organisationId=org1&uid=${sameUid}`,
      } as NextRequest;

      const res = await DELETE(req);

      // Verify 400 status code for self-deletion attempt
      expect(res.status).toBe(400);

      // Check the error message
      const responseData = await res.json();
      expect(responseData).toHaveProperty('message');
      expect(responseData.message).toContain(
        'you can not delete your self as an admin',
      );
    });

    it('should make all three DB remove calls when deleting a user', async () => {
      // Mock token ID
      mocks.getTokenId.mockReturnValue('mock-token-id');

      // Create spy objects to track the ref calls
      const refSpy = vi.fn().mockReturnThis();
      const removeSpy = vi.fn().mockResolvedValue(undefined);

      // Set up DB mock with spies
      mockGetDB.mockReturnValue({
        ref: refSpy,
        remove: removeSpy,
      });

      // Set up auth mock
      mockAdminAuth.mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: 'current-admin-id',
          orgAdmins: { org1: true },
        }),
        getUser: vi.fn().mockResolvedValue({
          uid: 'user-to-delete',
          customClaims: { allowedOrgs: { org1: true } },
        }),
        setCustomUserClaims: vi.fn(),
      });

      const req = {
        url: 'http://localhost/api/admin/user?organisationId=org1&uid=user-to-delete',
      } as NextRequest;

      const res = await DELETE(req);
      expect(res.status).toBe(200);

      // Verify all three database ref calls were made with correct paths
      expect(refSpy).toHaveBeenCalledTimes(4); // 3 remove calls + 1 for removeOrgClaim
      expect(refSpy).toHaveBeenCalledWith(
        `/organisationsUsers/org1/user-to-delete`,
      );
      expect(refSpy).toHaveBeenCalledWith(
        `/organisations/org1/users/user-to-delete`,
      );
      expect(refSpy).toHaveBeenCalledWith(
        `/organisationRoles/org1/user-to-delete`,
      );

      // Verify remove was called for each ref
      expect(removeSpy).toHaveBeenCalledTimes(4); // 3 calls in delete + 1 in removeOrgClaim
    });
  });
});
