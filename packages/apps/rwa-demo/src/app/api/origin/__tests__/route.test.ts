import { getOriginKey } from '@/utils/getOriginKey';
import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../route';

// Mocks

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

  it('continues processing when headers are null, use fallback', async () => {
    const testOrigin = 'https://mastersoftheuniverse.com';

    const mockEqualTo = vi.fn(() => ({ once: mockOnce }));
    mockOrderByChild.mockReturnValueOnce({ equalTo: mockEqualTo });
    mockOnce.mockResolvedValueOnce({ toJSON: () => ({}) });

    const request = {
      headers: {
        get: vi.fn(() => null),
      },
      nextUrl: {
        host: testOrigin,
      },
    } as unknown as NextRequest;

    const response = await GET(request);
    expect(mockOrderByChild).toHaveBeenCalledWith(
      `domains/${getOriginKey(testOrigin)}/value`,
    );
    expect(mockEqualTo).toHaveBeenCalledWith(testOrigin);
    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe('no correct domain found');
  });

  it('returns 500 if no correct domain found', async () => {
    mockOnce.mockResolvedValueOnce({ toJSON: () => ({}) });
    const request = {
      headers: {
        get: vi.fn((header) =>
          header === 'x-forwarded-host'
            ? 'mastersoftheuniverse.com'
            : header === 'x-forwarded-proto'
              ? 'https'
              : null,
        ),
      },
      nextUrl: {
        host: 'localhost:3000',
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
        get: vi.fn((header) =>
          header === 'x-forwarded-host'
            ? 'mastersoftheuniverse.com'
            : header === 'x-forwarded-proto'
              ? 'https'
              : null,
        ),
      },
      nextUrl: {
        host: 'localhost:3000',
      },
    } as unknown as NextRequest;
    const response = await GET(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ organisationId: 'org1' });
  });

  it('reads the origin from x-forwarded-host header', async () => {
    mockOnce.mockResolvedValueOnce({ toJSON: () => ({}) });
    const request = {
      headers: {
        get: vi.fn((header) =>
          header === 'x-forwarded-host'
            ? 'header-origin.com'
            : header === 'x-forwarded-proto'
              ? 'https'
              : null,
        ),
      },
      nextUrl: {
        host: 'localhost:3000',
      },
    } as unknown as NextRequest;
    await GET(request);
    expect(request.headers.get).toHaveBeenCalledWith('x-forwarded-host');
    expect(request.headers.get).toHaveBeenCalledWith('x-forwarded-proto');
  });

  it('returns 500 if origin is actually missing', async () => {
    mockOnce.mockResolvedValueOnce({ toJSON: () => ({}) });
    const request = {
      headers: {
        get: vi.fn((header) =>
          header === 'x-forwarded-proto'
            ? ''
            : header === 'x-forwarded-host'
              ? ''
              : null,
        ),
      },
      nextUrl: {
        host: '', // Empty host to make it falsy
      },
    } as unknown as NextRequest;
    const response = await GET(request);
    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe('origin not found');
  });

  it('queries the database with correct parameters when origin exists', async () => {
    const mockEqualTo = vi.fn(() => ({ once: mockOnce }));
    mockOrderByChild.mockReturnValueOnce({ equalTo: mockEqualTo });
    mockOnce.mockResolvedValueOnce({ toJSON: () => ({}) });

    const testOrigin = 'https://example.com';
    const request = {
      headers: {
        get: vi.fn((header) =>
          header === 'x-forwarded-host'
            ? 'example.com'
            : header === 'x-forwarded-proto'
              ? 'https'
              : null,
        ),
      },
      nextUrl: {
        host: 'localhost:3000',
      },
    } as unknown as NextRequest;

    await GET(request);

    // Verify database query structure
    expect(mockRef).toHaveBeenCalledWith('organisationsData');
    expect(mockOrderByChild).toHaveBeenCalledWith(
      `domains/${getOriginKey(testOrigin)}/value`,
    );
    expect(mockEqualTo).toHaveBeenCalledWith(testOrigin);
    expect(mockOnce).toHaveBeenCalledWith('value');
  });
});
