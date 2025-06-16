import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockVerifyIdToken = vi.hoisted(() => vi.fn());

const mocks = vi.hoisted(() => {
  return {
    mockAdminAuth: vi.fn(() => ({ verifyIdToken: mockVerifyIdToken })),
  };
});

vi.mock('./../admin/app', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    adminAuth: mocks.mockAdminAuth,
  };
});

describe('withAuth', () => {
  let handler: (
    req: NextRequest,
    context?: Record<string, unknown>,
  ) => Promise<Response>;
  let req: NextRequest;
  let context: Record<string, unknown>;

  beforeEach(() => {
    handler = vi.fn(async () => new Response('ok', { status: 200 }));
    // Default: no authorization header
    req = {
      url: 'http://localhost',
      headers: new Headers(),
    } as unknown as NextRequest;
    context = {};
  });

  it('returns 401 if no token or adminAuth fails', async () => {
    const { withAuth } = await import('./../withAuth');
    // No authorization header set
    mocks.mockAdminAuth.mockReturnValue({ verifyIdToken: mockVerifyIdToken });
    const wrapped = withAuth(handler);
    const res = await wrapped(req, context);
    expect(res.status).toBe(401);
  });

  it('returns 500 if verifyIdToken returns no uid', async () => {
    const { withAuth } = await import('./../withAuth');
    // Set valid authorization header
    req = {
      url: 'http://localhost',
      headers: new Headers({ authorization: 'Bearer token' }),
    } as unknown as NextRequest;
    mockVerifyIdToken.mockResolvedValue({});
    const wrapped = withAuth(handler);
    const res = await wrapped(req, context);
    expect(res.status).toBe(500);
  });

  it('calls handler if authenticated', async () => {
    const { withAuth } = await import('./../withAuth');
    // Set valid authorization header
    req = {
      url: 'http://localhost',
      headers: new Headers({ authorization: 'Bearer token' }),
    } as unknown as NextRequest;
    mockVerifyIdToken.mockResolvedValue({ uid: '123' });
    const wrapped = withAuth(handler);
    const res = await wrapped(req, context);
    expect(handler).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });
});

describe('withRootAdmin', () => {
  let handler: (
    req: NextRequest,
    context?: Record<string, unknown>,
  ) => Promise<Response>;
  let req: NextRequest;
  let context: Record<string, unknown>;

  beforeEach(() => {
    handler = vi.fn(async () => new Response('ok', { status: 200 }));
    req = {
      url: 'http://localhost',
      headers: new Headers({ authorization: 'Bearer token' }),
    } as unknown as NextRequest;
    context = {};
  });

  it('returns 401 if not root admin', async () => {
    const { withRootAdmin } = await import('./../withAuth');
    mockVerifyIdToken.mockResolvedValue({});
    const wrapped = withRootAdmin(handler);
    const res = await wrapped(req, context);
    expect(res.status).toBe(401);
  });

  it('calls handler if user is root admin', async () => {
    const { withRootAdmin } = await import('./../withAuth');
    mockVerifyIdToken.mockResolvedValue({ uid: '123', rootAdmin: true });
    const wrapped = withRootAdmin(handler);
    const res = await wrapped(req, context);
    expect(handler).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });
});

describe('withOrgAdmin', () => {
  let handler: (
    req: NextRequest,
    context?: Record<string, unknown>,
  ) => Promise<Response>;
  let req: NextRequest;
  let context: Record<string, unknown>;

  beforeEach(() => {
    handler = vi.fn(async () => new Response('ok', { status: 200 }));
    req = {
      url: 'http://localhost?organisationId=org1',
      headers: new Headers({ authorization: 'Bearer token' }),
    } as unknown as NextRequest;
    context = {};
  });

  it('returns 401 if not root admin or org admin', async () => {
    const { withOrgAdmin } = await import('./../withAuth');
    mockVerifyIdToken.mockResolvedValue({ uid: '123', orgAdmins: {} });
    const wrapped = withOrgAdmin(handler);
    const res = await wrapped(req, context);
    expect(res.status).toBe(401);
  });

  it('calls handler if user is root admin', async () => {
    const { withOrgAdmin } = await import('./../withAuth');
    mockVerifyIdToken.mockResolvedValue({
      uid: '123',
      rootAdmin: true,
      orgAdmins: {},
    });
    const wrapped = withOrgAdmin(handler);
    const res = await wrapped(req, context);
    expect(handler).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it('calls handler if user is org admin for org', async () => {
    const { withOrgAdmin } = await import('./../withAuth');
    mockVerifyIdToken.mockResolvedValue({
      uid: '123',
      orgAdmins: { org1: true },
    });
    const wrapped = withOrgAdmin(handler);
    const res = await wrapped(req, context);
    expect(handler).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });
});
