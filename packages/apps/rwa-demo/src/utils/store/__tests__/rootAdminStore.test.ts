import type { IdTokenResultWithClaims } from '@/providers/UserProvider/UserProvider';
import { get, push, ref, set } from 'firebase/database';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RootAdminStore } from '../rootAdminStore';

// Mock firebase/database
vi.mock('firebase/database', () => ({
  ref: vi.fn((db, path) => path),
  onValue: vi.fn((ref, cb) => {
    // Simulate a snapshot with .val()
    cb({ val: () => ({ admin1: true, admin2: true }) });
  }),
  off: vi.fn(),
  push: vi.fn(() => ({ key: 'mock-org-key' })),
  set: vi.fn(() => Promise.resolve()),
  get: vi.fn(() =>
    Promise.resolve({
      toJSON: () => ({
        org1: {
          id: 'org1',
          name: 'Organization 1',
          domains: {
            domain1: { value: 'example.com' },
            domain2: { value: 'test.com' },
          },
          sendEmail: 'admin@org1.com',
        },
        org2: {
          id: 'org2',
          name: 'Organization 2',
          domains: {
            domain3: { value: 'company.com' },
            domain4: { value: 'business.org' },
          },
          sendEmail: 'admin@org2.com',
        },
      }),
    }),
  ),
}));

// Mock fetch
const mockFetch = vi.fn(async (url, options) => {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
globalThis.fetch = mockFetch as typeof fetch;

describe('RootAdminStore', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('listenToAdmins calls setDataCallback with admin keys', () => {
    const store = RootAdminStore();
    const cb = vi.fn();
    store.listenToAdmins(cb);
    expect(cb).toHaveBeenCalledWith(['admin1', 'admin2']);
  });

  it('setAdmin calls fetch with correct params', async () => {
    const store = RootAdminStore();
    const token: IdTokenResultWithClaims = {
      token: 'mock-token',
      authTime: '',
      expirationTime: '',
      issuedAtTime: '',
      signInProvider: null,
      signInSecondFactor: null,
      claims: {},
    };
    await store.setAdmin({ email: 'test@example.com', token });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/admin/claims',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-token',
        }),
      }),
    );
  });

  it('removeAdmin calls fetch with correct params', async () => {
    const store = RootAdminStore();
    const token: IdTokenResultWithClaims = {
      token: 'mock-token',
      authTime: '',
      expirationTime: '',
      issuedAtTime: '',
      signInProvider: null,
      signInSecondFactor: null,
      claims: {},
    };
    await store.removeAdmin({ uid: 'uid1', token });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/admin/claims?uid=uid1',
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-token',
        }),
      }),
    );
  });

  it('createOrganisation creates organisation in database and returns key', async () => {
    const store = RootAdminStore();
    const mockOrganisation = {
      id: 'org-123',
      name: 'Test Organisation',
      domains: [{ value: 'test.com' }, { value: 'example.com' }],
      sendEmail: 'admin@test.com',
    };

    const result = await store.createOrganisation(mockOrganisation);

    // Verify ref was called with the correct paths
    expect(ref).toHaveBeenCalledWith(undefined, '/organisationsData');
    expect(ref).toHaveBeenCalledWith(
      undefined,
      '/organisationsData/mock-org-key',
    );

    // Verify push was called with the result of ref()
    expect(push).toHaveBeenCalledWith('/organisationsData');

    // Verify set was called with the result of ref() and data
    expect(set).toHaveBeenCalledWith(
      '/organisationsData/mock-org-key',
      mockOrganisation,
    );

    expect(result).toBe('mock-org-key');
  });

  it('removeOrganisation removes organisation from database', async () => {
    const store = RootAdminStore();
    const organisationId = 'org-to-remove';

    await store.removeOrganisation(organisationId);

    // Verify ref was called with the correct path
    expect(ref).toHaveBeenCalledWith(
      undefined,
      `/organisationsData/${organisationId}`,
    );

    // Verify set was called with null to delete the organisation
    expect(set).toHaveBeenCalledWith(
      `/organisationsData/${organisationId}`,
      null,
    );
  });

  it('getAllDomains returns all domain values from all organisations', async () => {
    const store = RootAdminStore();
    const result = await store.getAllDomains();

    // Verify get was called with the correct path
    expect(get).toHaveBeenCalledWith('/organisationsData');

    // Verify it returns all domains from all organisations
    expect(result).toEqual([
      'example.com',
      'test.com',
      'company.com',
      'business.org',
    ]);
  });

  it('getAllDomains returns empty array when no organisations exist', async () => {
    // Mock get to return empty data
    const mockGet = vi.mocked(get);
    mockGet.mockResolvedValueOnce({
      toJSON: () => null,
    } as ReturnType<typeof get> extends Promise<infer T> ? T : never);

    const store = RootAdminStore();
    const result = await store.getAllDomains();

    expect(result).toEqual([]);
  });

  it('getAllDomains handles organisations without domains', async () => {
    // Mock get to return organisations without domains
    const mockGet = vi.mocked(get);
    mockGet.mockResolvedValueOnce({
      toJSON: () => ({
        org1: {
          id: 'org1',
          name: 'Organization 1',
          sendEmail: 'admin@org1.com',
          // no domains property
        },
        org2: {
          id: 'org2',
          name: 'Organization 2',
          domains: {}, // empty domains
          sendEmail: 'admin@org2.com',
        },
      }),
    } as ReturnType<typeof get> extends Promise<infer T> ? T : never);

    const store = RootAdminStore();
    const result = await store.getAllDomains();

    expect(result).toEqual([]);
  });
});
