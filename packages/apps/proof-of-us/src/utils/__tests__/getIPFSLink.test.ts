import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getIPFSLink } from '../getIPFSLink';

const mocks = vi.hoisted(() => {
  return {
    env: {
      URL: 'https://masters-of-the-universe.com',
    },
  };
});

describe('getIPFSLink', () => {
  beforeEach(() => {
    vi.mock('./../env', () => {
      return { env: mocks.env };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return the nftstorage proxy link', () => {
    const url =
      'https://bafybeieodyy6rxlwzrcwrocpsu4b7ediv5fafqiczd5a7ime6h2ztvz2ze.ipfs.nftstorage.link/metadata';
    const expectedUrl =
      'https://masters-of-the-universe.com/api/ipfs/bafybeieodyy6rxlwzrcwrocpsu4b7ediv5fafqiczd5a7ime6h2ztvz2ze/nftstorage/metadata';
    const result = getIPFSLink(url);
    expect(result).toBe(expectedUrl);
  });

  it('should return the ipfs.io proxy link', () => {
    const url =
      'https://ipfs.io/ipfs/QmV35YjVXCVcoDUZFzUkci62hf7DjGEUnRFchLjGpMWi4g';
    const expectedUrl =
      'https://masters-of-the-universe.com/pinata/QmV35YjVXCVcoDUZFzUkci62hf7DjGEUnRFchLjGpMWi4g';
    const result = getIPFSLink(url);
    expect(result).toBe(expectedUrl);
  });

  it('should return the the normal link if it is not nftstorage or ipfs.io ', () => {
    const url = 'https://masters-of-the-universe.com';
    const result = getIPFSLink('https://masters-of-the-universe.com');
    expect(result).toBe(url);
  });
});
