import { isImage } from '../utils/isImage';

describe('isImage', () => {
  it('should return true if the file extension is allowed', async () => {
    let path = './public/assets/docs/he-man.png';
    expect(isImage(path)).toEqual(true);

    path = './public/assets/docs/skeletor.webp';
    expect(isImage(path)).toEqual(true);

    path = './public/assets/docs/man-at-arms.jpeg';
    expect(isImage(path)).toEqual(true);

    path = './public/assets/docs/greyskull.jpg';
    expect(isImage(path)).toEqual(true);

    path = './public/assets/docs/teela.gif';
    expect(isImage(path)).toEqual(true);
  });

  it('should return false if the file extension is NOT allowed', async () => {
    const path = './public/assets/docs/zodac.bmp';
    expect(isImage(path)).toEqual(false);
  });

  it('should return true if allowed file extension is upperrcase ', async () => {
    const path = './public/assets/docs/zodac.PNG';
    expect(isImage(path)).toEqual(true);
  });
});
