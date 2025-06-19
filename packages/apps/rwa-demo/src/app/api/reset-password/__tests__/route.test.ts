import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock firebase/auth and @/utils/store/firebase
vi.mock('firebase/auth', () => ({
  confirmPasswordReset: vi.fn(),
}));
vi.mock('@/utils/store/firebase', () => ({
  auth: {},
}));

import { confirmPasswordReset } from 'firebase/auth';
import { POST } from '../route';

const mockRequest = (body: unknown): NextRequest => {
  return {
    json: async () => body,
  } as unknown as NextRequest;
};

describe('POST /api/reset-password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 500 if oobCode is missing', async () => {
    const req = mockRequest({ password: 'newpass' });
    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(res.statusText).toBe('oobCode not found');
  });

  it('returns 500 if confirmPasswordReset throws', async () => {
    (
      confirmPasswordReset as unknown as {
        mockRejectedValueOnce: (err: Error) => void;
      }
    ).mockRejectedValueOnce(new Error('fail'));
    const req = mockRequest({ oobCode: 'code', password: 'newpass' });
    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(res.statusText).toBe('Error confirming password reset');
  });

  it('returns 200 if password reset is successful', async () => {
    (
      confirmPasswordReset as unknown as {
        mockResolvedValueOnce: (v: unknown) => void;
      }
    ).mockResolvedValueOnce(undefined);
    const req = mockRequest({ oobCode: 'code', password: 'newpass' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.statusText).toBe('Password was succesfully reset');
  });
});
