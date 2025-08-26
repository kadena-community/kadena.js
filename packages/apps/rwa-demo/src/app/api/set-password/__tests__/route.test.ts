import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './../route';

// Mock adminAuth and its methods
vi.mock('../../admin/app', () => ({
  adminAuth: vi.fn(),
}));

const mockGetUserByEmail = vi.fn();
const mockUpdateUser = vi.fn();

import { adminAuth } from '../../admin/app';

(
  adminAuth as unknown as {
    mockImplementation: (
      fn: () => {
        getUserByEmail: typeof mockGetUserByEmail;
        updateUser: typeof mockUpdateUser;
      },
    ) => void;
  }
).mockImplementation(() => ({
  getUserByEmail: mockGetUserByEmail,
  updateUser: mockUpdateUser,
}));

// Use type assertion to NextRequest for req, and avoid 'any'.
import type { NextRequest } from 'next/server';

describe('POST /api/set-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 500 if password or email is missing', async () => {
    const req = { json: async () => ({}) } as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('returns 404 if user is not found', async () => {
    mockGetUserByEmail.mockResolvedValueOnce(undefined);
    const req = {
      json: async () => ({
        email: 'he-man@mastersoftheuniverse.com',
        password: 'pw',
      }),
    } as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it('returns 404 when email is not found', async () => {
    mockGetUserByEmail.mockResolvedValueOnce(undefined);
    const req = {
      json: async () => ({
        email: 'skeletor@mastersoftheuniverse.com',
        password: 'pw',
      }),
    } as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(404);
    const text = await res.text();
    expect(text).toContain('User not found');
  });

  it('returns 500 if adminAuth throws', async () => {
    mockGetUserByEmail.mockRejectedValueOnce(new Error('fail'));
    const req = {
      json: async () => ({
        email: 'he-man@mastersoftheuniverse.com',
        password: 'pw',
      }),
    } as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('returns 200 if password is set successfully', async () => {
    mockGetUserByEmail.mockResolvedValueOnce({ uid: '123' });
    mockUpdateUser.mockResolvedValueOnce(undefined);
    const req = {
      json: async () => ({
        email: 'orko@mastersoftheuniverse.com',
        password: 'pw',
      }),
    } as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('successfully verified');
  });
});
