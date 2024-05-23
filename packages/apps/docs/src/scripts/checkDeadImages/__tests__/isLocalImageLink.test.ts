import type { Image } from 'mdast';
import { isLocalImageLink } from '../';

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
