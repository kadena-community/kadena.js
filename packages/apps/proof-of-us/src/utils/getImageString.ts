import fetch from 'cross-fetch';

export const getImageString = async (uri?: string): Promise<string> => {
  if (!uri) return '';

  const imageUri = uri;
  console.log({ imageUri });
  const response = await fetch(imageUri);
  console.log(response);
  const base64_body = (await (response as any).buffer()).toString('base64');

  return `data:image/jpeg;base64,${base64_body}`;
};
