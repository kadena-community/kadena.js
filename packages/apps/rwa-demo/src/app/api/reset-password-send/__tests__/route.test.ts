import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../route';

vi.mock('../../admin/app', () => ({
  adminAuth: vi.fn(),
}));

const mockGetUserByEmail = vi.fn();
const mockGeneratePasswordResetLink = vi.fn();

import { sendResetMail } from '@/utils/sendResetMail';
import { adminAuth } from '../../admin/app';

(
  adminAuth as unknown as {
    mockImplementation: (
      fn: () => {
        getUserByEmail: typeof mockGetUserByEmail;
        generatePasswordResetLink: typeof mockGeneratePasswordResetLink;
      },
    ) => void;
  }
).mockImplementation(() => ({
  getUserByEmail: mockGetUserByEmail,
  generatePasswordResetLink: mockGeneratePasswordResetLink,
}));

vi.mock('@/utils/sendResetMail', () => ({
  sendResetMail: vi.fn(),
}));

import type { NextRequest } from 'next/server';

describe('POST /api/reset-password-send', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 500 if email or organisationId is missing', async () => {
    const req = { json: async () => ({}) } as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('returns 500 if user is not found', async () => {
    mockGetUserByEmail.mockResolvedValueOnce(undefined);
    const req = {
      json: async () => ({
        email: 'he-man@mastersoftheuniverse.com',
        organisationId: 'org1',
      }),
    } as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('returns 200 and sends reset mail if all is valid', async () => {
    mockGetUserByEmail.mockResolvedValueOnce({
      uid: '123',
      email: 'skeletor@mastersoftheuniverse.com',
    });
    mockGeneratePasswordResetLink.mockResolvedValueOnce('reset-link');
    const req = {
      json: async () => ({
        email: 'skeletor@mastersoftheuniverse.com',
        organisationId: 'org1',
      }),
    } as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(sendResetMail).toHaveBeenCalledWith({
      user: { uid: '123', email: 'skeletor@mastersoftheuniverse.com' },
      emailVerificationLink: 'reset-link',
      organisationId: 'org1',
    });
  });
});
