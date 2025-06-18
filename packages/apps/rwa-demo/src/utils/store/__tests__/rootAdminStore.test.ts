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
}));

// Mock fetch
const mockFetch = vi.fn(async (url, options) => {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
globalThis.fetch = mockFetch as typeof fetch;

// Minimal IIdTokenResult mock type
interface IIdTokenResult {
  token: string;
  authTime: string;
  expirationTime: string;
  issuedAtTime: string;
  signInProvider: string | null;
  signInSecondFactor: string | null;
  claims: Record<string, unknown>;
}

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
    const token: IIdTokenResult = {
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
    const token: IIdTokenResult = {
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
});
