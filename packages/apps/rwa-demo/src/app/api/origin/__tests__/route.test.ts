import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../route';

// Mocks
vi.mock('@/utils/getOriginKey', () => ({
  getOriginKey: vi.fn((origin) => `mocked-key-${origin}`),
}));

const mockOnce = vi.fn();
const mockOrderByChild = vi.fn(() => ({
  equalTo: vi.fn(() => ({ once: mockOnce })),
}));
const mockRef = vi.fn(() => ({ orderByChild: mockOrderByChild }));

vi.mock('../../admin/app', () => ({
  getDB: () => ({ ref: mockRef }),
}));

describe('GET /api/origin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 500 if origin is missing', async () => {
    const request = {
      headers: {
        get: vi.fn(() => null),
      },
    } as unknown as NextRequest;
    const response = await GET(request);
    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe('origin not found');
  });

  it('returns 500 if no correct domain found', async () => {
    mockOnce.mockResolvedValueOnce({ toJSON: () => ({}) });
    const request = {
      headers: {
        get: vi.fn(() => 'https://mastersoftheuniverse.com'),
      },
    } as unknown as NextRequest;
    const response = await GET(request);
    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe('no correct domain found');
  });

  it('returns 200 and organisationId if found', async () => {
    mockOnce.mockResolvedValueOnce({
      toJSON: () => ({ org1: { name: 'Org1', domains: {} } }),
    });
    const request = {
      headers: {
        get: vi.fn(() => 'https://mastersoftheuniverse.com'),
      },
    } as unknown as NextRequest;
    const response = await GET(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ organisationId: 'org1' });
  });

  it('calls getOriginKey with the correct origin', async () => {
    const { getOriginKey } = await import('@/utils/getOriginKey');
    mockOnce.mockResolvedValueOnce({ toJSON: () => ({}) });
    const request = {
      headers: {
        get: vi.fn((header) =>
          header === 'x-forwarded-host' ? 'header-origin.com' : undefined,
        ),
      },
    } as unknown as NextRequest;
    await GET(request);
    expect(getOriginKey).toHaveBeenCalledWith('header-origin.com');
  });

  it('reads the origin from x-forwarded-host header', async () => {
    mockOnce.mockResolvedValueOnce({ toJSON: () => ({}) });
    const request = {
      headers: {
        get: vi.fn((header) =>
          header === 'x-forwarded-host' ? 'header-origin.com' : undefined,
        ),
      },
    } as unknown as NextRequest;
    await GET(request);
    expect(request.headers.get).toHaveBeenCalledWith('x-forwarded-host');
  });

  it('logs origin and headers', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockOnce.mockResolvedValueOnce({ toJSON: () => ({}) });
    const request = {
      headers: {
        get: vi.fn((header) =>
          header === 'x-forwarded-host' ? 'header-origin.com' : undefined,
        ),
      },
    } as unknown as NextRequest;
    await GET(request);
    expect(logSpy).toHaveBeenCalledWith(
      'origin',
      'header-origin.com',
      'mocked-key-header-origin.com',
    );
    expect(logSpy).toHaveBeenCalledWith(request.headers, 'request.nextUrl');
    logSpy.mockRestore();
  });
});
