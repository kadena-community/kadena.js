import QRCode from 'qrcode';

export const createQR = async (data: string) => {
  try {
    return QRCode.toDataURL(data, {
      quality: 1,
      type: 'image/webp',
      scale: 10,
      margin: 2,
      width: '500',
    });
  } catch (err) {
    return err;
  }
};
