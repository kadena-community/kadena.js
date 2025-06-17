import { getApps } from 'firebase-admin/app';
import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock firebase-admin modules
vi.mock('firebase-admin/app', () => ({
  cert: vi.fn((c) => c),
  getApps: vi.fn(() => []),
  initializeApp: vi.fn((config) => ({ config })),
}));
vi.mock('firebase-admin/auth', () => ({
  getAuth: vi.fn(() => 'mockAuth'),
}));
vi.mock('firebase-admin/database', () => ({
  getDatabase: vi.fn(() => 'mockDB'),
}));

describe('getTokenId', () => {
  it('returns token if authorization header is valid', async () => {
    const adminApp = await import('../admin/app');
    const req = {
      headers: new Headers({ authorization: 'Bearer mytoken' }),
    } as unknown as NextRequest;
    expect(adminApp.getTokenId(req)).toBe('mytoken');
  });

  it('returns empty string if no authorization header', async () => {
    const adminApp = await import('../admin/app');
    const req = { headers: new Headers() } as unknown as NextRequest;
    expect(adminApp.getTokenId(req)).toBe('');
  });

  it('returns empty string if authorization header is malformed', async () => {
    const adminApp = await import('../admin/app');
    const req = {
      headers: new Headers({ authorization: 'Token mytoken' }),
    } as unknown as NextRequest;
    expect(adminApp.getTokenId(req)).toBe('');
  });
});

describe('adminAuth', () => {
  beforeEach(() => {
    vi.mocked(getApps).mockReturnValue([]);
  });
  it('calls getApp and getAuth', async () => {
    const adminApp = await import('../admin/app');
    expect(adminApp.adminAuth()).toBe('mockAuth');
  });
});

describe('getDB', () => {
  beforeEach(() => {
    vi.mocked(getApps).mockReturnValue([]);
  });
  it('calls getApp and getDatabase', async () => {
    const adminApp = await import('../admin/app');
    expect(adminApp.getDB()).toBe('mockDB');
  });
});
