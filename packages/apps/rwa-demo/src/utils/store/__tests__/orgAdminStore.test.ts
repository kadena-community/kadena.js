import type { IdTokenResult } from 'firebase/auth';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OrgAdminStore } from '../../store/orgAdminStore';

// Mocks for dependencies
vi.mock('../store/firebase', () => ({
  database: {},
}));
vi.mock('firebase/database', () => ({
  ref: vi.fn((db, path) => path),
  onValue: vi.fn((ref, cb) => {
    cb({ val: () => ({ admin1: true }) });
  }),
  off: vi.fn(),
}));

describe('OrgAdminStore', () => {
  const organisationId = 'org1';
  const mockToken: IdTokenResult = {
    token: 'mock-token',
    authTime: '',
    claims: {},
    expirationTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
  };

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('listenToAdmins calls setDataCallback with admin uids', () => {
    const store = OrgAdminStore(organisationId);
    const cb = vi.fn();
    store.listenToAdmins(cb);
    expect(cb).toHaveBeenCalledWith(['admin1']);
  });

  it('getUserList calls fetch with correct params', async () => {
    const store = OrgAdminStore(organisationId);
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue({} as Response);
    await store.getUserList(mockToken);
    expect(fetchSpy).toHaveBeenCalledWith(
      `/api/admin/users?organisationId=${organisationId}`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken.token}`,
        }),
      }),
    );
  });

  it('setAdmin calls fetch with correct params', async () => {
    const store = OrgAdminStore(organisationId);
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue({} as Response);
    await store.setAdmin({ email: 'admin@example.com', token: mockToken });
    expect(fetchSpy).toHaveBeenCalledWith(
      `/api/admin/claims?organisationId=${organisationId}`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'admin@example.com',
          organisationId,
        }),
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken.token}`,
        }),
      }),
    );
  });

  it('removeAdmin calls fetch with correct params', async () => {
    const store = OrgAdminStore(organisationId);
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue({} as Response);
    await store.removeAdmin({ uid: 'admin1', token: mockToken });
    expect(fetchSpy).toHaveBeenCalledWith(
      `/api/admin/claims?uid=admin1&organisationId=${organisationId}`,
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken.token}`,
        }),
      }),
    );
  });

  it('setUser calls fetch with correct params', async () => {
    const store = OrgAdminStore(organisationId);
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue({} as Response);
    await store.setUser({ email: 'user@example.com', token: mockToken });
    expect(fetchSpy).toHaveBeenCalledWith(
      `/api/admin/user?organisationId=${organisationId}`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          organisationId,
        }),
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken.token}`,
        }),
      }),
    );
  });

  it('removeUser calls fetch with correct params', async () => {
    const store = OrgAdminStore(organisationId);
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue({} as Response);
    await store.removeUser({ uid: 'user1', token: mockToken });
    expect(fetchSpy).toHaveBeenCalledWith(
      `/api/admin/user?uid=user1&organisationId=${organisationId}`,
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken.token}`,
        }),
      }),
    );
  });
});
