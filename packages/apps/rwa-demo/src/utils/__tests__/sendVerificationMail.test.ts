import type { UserRecord } from 'firebase-admin/auth';
import { vi } from 'vitest';

const mockUser: UserRecord = { email: 'test@example.com' } as UserRecord;
const mockOrganisation = {
  name: 'He-man',
  sendEmail: 'noreply@mastersoftheuniverse.org',
  domains: { main: { value: 'https://mastersoftheuniverse.org' } },
};

const mocks = vi.hoisted(() => {
  return {
    mockGetDB: vi.fn().mockReturnValue({
      ref: vi.fn().mockReturnThis(),
      once: vi.fn().mockResolvedValue({ toJSON: () => mockOrganisation }),
    }),
    mockMailgun: vi.fn().mockImplementation(() => ({
      client: vi.fn().mockReturnValue({
        messages: {
          create: vi.fn().mockResolvedValue('mail sent'),
        },
      }),
    })),
  };
});

const OLD_ENV = process.env;

describe('sendVerificationMail', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...OLD_ENV,
      MAILGUN_APIKEY: 'key',
      NEXT_PUBLIC_MAILGUN_DOMAIN: 'rwa.kadena.io',
    };
    vi.doMock('@/app/api/admin/app', () => ({ getDB: mocks.mockGetDB }));
    vi.doMock('mailgun.js', () => ({ default: mocks.mockMailgun }));
    vi.doMock('form-data', () => ({ default: {} }));
  });

  afterEach(() => {
    process.env = OLD_ENV;
    vi.clearAllMocks();
  });

  it('sends a verification mail successfully', async () => {
    const { sendVerificationMail } = await import('../sendVerificationMail');
    const emailVerificationLink =
      'https://mastersoftheuniverse.org/verify?oobCode=abc123';
    await expect(
      sendVerificationMail({
        user: mockUser,
        emailVerificationLink,
        organisationId: 'org1',
      }),
    ).resolves.toBeUndefined();
  });

  it('throws if MAILGUN_APIKEY is missing', async () => {
    const { sendVerificationMail } = await import('../sendVerificationMail');
    process.env.MAILGUN_APIKEY = '';
    await expect(
      sendVerificationMail({
        user: mockUser,
        emailVerificationLink:
          'https://mastersoftheuniverse.org/verify?oobCode=abc123',
        organisationId: 'org1',
      }),
    ).rejects.toThrow('MAILGUN_APIKEY is not set');
  });

  it('throws if user email is missing', async () => {
    const { sendVerificationMail } = await import('../sendVerificationMail');
    const userNoEmail = {} as UserRecord;
    await expect(
      sendVerificationMail({
        user: userNoEmail,
        emailVerificationLink:
          'https://mastersoftheuniverse.org/verify?oobCode=abc123',
        organisationId: 'org1',
      }),
    ).rejects.toThrow('No email found for user');
  });

  it('throws if organisation not found', async () => {
    const { sendVerificationMail } = await import('../sendVerificationMail');
    mocks.mockGetDB().once.mockResolvedValueOnce({ toJSON: () => null });
    await expect(
      sendVerificationMail({
        user: mockUser,
        emailVerificationLink:
          'https://mastersoftheuniverse.org/verify?oobCode=abc123',
        organisationId: 'org1',
      }),
    ).rejects.toThrow('Organisation not found');
  });
});
