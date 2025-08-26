import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@/utils/store/firebase', () => ({
  auth: {},
}));
vi.mock('firebase/auth', () => ({
  applyActionCode: vi.fn(),
}));
vi.mock('./../../admin/app', () => ({
  adminAuth: vi.fn(),
}));

import * as firebaseAuth from 'firebase/auth';
import * as adminApp from './../../admin/app';

describe('POST /api/verify', () => {
  let route: { POST: (req: NextRequest) => Promise<Response> };
  let mockApplyActionCode: ReturnType<typeof vi.fn>;
  let mockAdminAuth: unknown;
  let mockGetUserByEmail: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetAllMocks();
    route = await import('../route');
    mockApplyActionCode = vi.fn();
    // @ts-expect-error: test override
    firebaseAuth.applyActionCode = mockApplyActionCode;
    mockGetUserByEmail = vi.fn();
    mockAdminAuth = vi.fn(() => ({ getUserByEmail: mockGetUserByEmail }));
    // @ts-expect-error: test override
    adminApp.adminAuth = mockAdminAuth;
  });

  it('returns 500 if oobCode is missing', async () => {
    const req = {
      json: async () => ({ email: 'test@example.com' }),
    } as NextRequest;
    const res = await route.POST(req);
    expect(res.status).toBe(500);
  });

  it('returns 200 if email is already verified', async () => {
    mockGetUserByEmail.mockResolvedValue({ emailVerified: true });
    const req = {
      json: async () => ({ oobCode: 'code', email: 'test@example.com' }),
    } as NextRequest;
    const res = await route.POST(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('email already verified');
  });

  it('calls applyActionCode and returns 200 on success', async () => {
    mockGetUserByEmail.mockResolvedValue({ emailVerified: false });
    mockApplyActionCode.mockResolvedValue(undefined);
    const req = {
      json: async () => ({ oobCode: 'code', email: 'test@example.com' }),
    } as NextRequest;
    const res = await route.POST(req);
    expect(mockApplyActionCode).toHaveBeenCalled();
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('successfully verified');
  });

  it('returns 500 if adminAuth throws', async () => {
    mockGetUserByEmail.mockRejectedValue(new Error('fail'));
    const req = {
      json: async () => ({ oobCode: 'code', email: 'test@example.com' }),
    } as NextRequest;
    const res = await route.POST(req);
    expect(res.status).toBe(500);
    const text = await res.text();
    expect(text).toBe('Internal Server Error');
  });
});
