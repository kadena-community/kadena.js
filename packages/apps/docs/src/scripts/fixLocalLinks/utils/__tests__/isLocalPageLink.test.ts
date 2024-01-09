import type { Image } from 'mdast-util-from-markdown/lib';
import { isLocalImageLink, isLocalPageLink } from '../isLocalPageLink';

describe('utils isLocalPageLink', () => {
  it('should return true if the path starts with dots', async () => {
    expect(isLocalPageLink('../../contribute/test.md')).toBe(true);
    expect(isLocalPageLink('./../contribute/test.md')).toBe(true);
    expect(isLocalPageLink('./../../../../contribute/test.md')).toBe(true);
  });
  it('should return false if the path starts with http', async () => {
    expect(isLocalPageLink('http://contribute.nl/test.md')).toBe(false);
    expect(isLocalPageLink('https://contribute.nl/test.md')).toBe(false);
  });
  it('should return true for valid file extensions', async () => {
    expect(isLocalPageLink('./contribute.nl/test.md')).toBe(true);
    expect(isLocalPageLink('./contribute.nl/test.mdx')).toBe(true);
    expect(isLocalPageLink('./contribute.nl/test.tsx')).toBe(true);
  });
  it('should return false for invalid file extensions', async () => {
    expect(isLocalPageLink('./contribute.nl/test.js')).toBe(false);
    expect(isLocalPageLink('./contribute.nl/test.jsx')).toBe(false);
    expect(isLocalPageLink('./contribute.nl/test.txt')).toBe(false);
  });
});

describe('utils isLocalImageLink', () => {
  it('should return true if the image url is relative', () => {
    const img: Image = {
      type: 'image',
      url: './..public/assets/test.webp',
    };

    expect(isLocalImageLink(img)).toBe(true);
  });

  it('should return false if the image url is not relative', () => {
    let img: Image = {
      type: 'image',
      url: './..public/test.webp',
    };

    expect(isLocalImageLink(img)).toBe(false);

    img = {
      type: 'image',
      url: 'http://public.nl/test.webp',
    };

    expect(isLocalImageLink(img)).toBe(false);
  });
});
