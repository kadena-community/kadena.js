import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as appModule from '../../app';
import { GET } from '../route';

const mocks = vi.hoisted(() => ({
  adminAuth: vi.fn(),
  getDB: vi.fn(),
  getTokenId: vi.fn(),
  mockDatabaseRef: {
    once: vi.fn(),
  },
  mockSnapshot: {
    toJSON: vi.fn(),
  },
}));

describe('admin users API routes', () => {
  let mockAdminAuth: ReturnType<typeof vi.fn>;
  let mockGetDB: ReturnType<typeof vi.fn>;
  let mockDBRef: { ref: ReturnType<typeof vi.fn> };
  let mockAuth: {
    verifyIdToken: ReturnType<typeof vi.fn>;
    getUsers: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.mock('../../app', () => ({
      adminAuth: mocks.adminAuth,
      getDB: mocks.getDB,
      getTokenId: mocks.getTokenId,
    }));

    mockAdminAuth = appModule.adminAuth as unknown as ReturnType<typeof vi.fn>;
    mockGetDB = appModule.getDB as unknown as ReturnType<typeof vi.fn>;

    // Setup mock database functions
    mocks.mockDatabaseRef.once.mockResolvedValue(mocks.mockSnapshot);
    mockDBRef = {
      ref: vi.fn().mockReturnValue(mocks.mockDatabaseRef),
    };
    mockGetDB.mockReturnValue(mockDBRef);

    // Mock token ID
    mocks.getTokenId.mockReturnValue('mock-token-id');

    // Mock auth functions with default root admin credentials
    mockAuth = {
      verifyIdToken: vi.fn().mockResolvedValue({
        uid: 'admin-user-id',
        rootAdmin: true,
      }),
      getUsers: vi.fn().mockResolvedValue({
        users: [],
      }),
    };
    mockAdminAuth.mockReturnValue(mockAuth);

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 404 if no organisationId is provided', async () => {
      const req = {
        url: 'http://localhost/api/admin/users',
      } as NextRequest;

      const res = await GET(req);

      expect(res.status).toBe(404);
      const body = await res.text();
      expect(body).toBe('no id found');
    });

    it('should return empty array if organisation has no users', async () => {
      const req = {
        url: 'http://localhost/api/admin/users?organisationId=org1',
      } as NextRequest;

      // Setup mock response for empty organisation
      mocks.mockSnapshot.toJSON.mockReturnValue(null);

      const res = await GET(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual([]);
      expect(mockDBRef.ref).toHaveBeenCalledWith('/organisationsUsers/org1');
    });

    it('should fetch and return users for the organisation', async () => {
      const req = {
        url: 'http://localhost/api/admin/users?organisationId=org1',
      } as NextRequest;

      // Setup organisation users in database
      mocks.mockSnapshot.toJSON.mockReturnValue({
        user1: true,
        user2: true,
      });

      // Setup mock user data from Firebase Auth
      mockAuth.getUsers.mockResolvedValue({
        users: [
          {
            uid: 'user1',
            email: 'user1@example.com',
            emailVerified: true,
            customClaims: {
              allowedOrgs: { org1: true },
              orgAdmins: { org1: true },
            },
          },
          {
            uid: 'user2',
            email: 'user2@example.com',
            emailVerified: false,
            customClaims: {
              allowedOrgs: { org1: true },
              rootAdmin: true,
            },
          },
          {
            uid: 'user3',
            email: 'user3@example.com',
            emailVerified: true,
            customClaims: {
              allowedOrgs: { org2: true },
            },
          },
        ],
      });

      const res = await GET(req);

      expect(res.status).toBe(200);
      const body = await res.json();

      // Should only return users with allowedOrgs[org1]
      expect(body).toHaveLength(2);
      expect(body).toEqual([
        {
          uid: 'user1',
          email: 'user1@example.com',
          emailVerified: true,
          isOrgAdmin: true,
          rootAdmin: false,
        },
        {
          uid: 'user2',
          email: 'user2@example.com',
          emailVerified: false,
          isOrgAdmin: false,
          rootAdmin: true,
        },
      ]);

      // Verify correct params were used to query Firebase
      expect(mockAuth.getUsers).toHaveBeenCalledWith([
        { uid: 'user1' },
        { uid: 'user2' },
      ]);
    });

    it('should handle error when getUsers fails', async () => {
      const req = {
        url: 'http://localhost/api/admin/users?organisationId=org1',
      } as NextRequest;

      // Setup organisation users in database
      mocks.mockSnapshot.toJSON.mockReturnValue({
        user1: true,
      });

      // Mock Firebase Auth getUsers failure
      mockAuth.getUsers.mockRejectedValue(new Error('Firebase error'));

      const res = await GET(req);
      expect(res.status).toBe(500);
      expect(res.statusText).toBe('Error fetching users');
    });
  });
});
