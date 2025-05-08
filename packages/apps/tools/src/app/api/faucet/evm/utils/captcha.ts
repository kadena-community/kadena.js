export const checkRecaptcha = async (token: string) => {
  const CAPTCHAKEY = process.env.CAPTCHA_SECRETKEY;
  const result = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHAKEY}&response=${token}`,
  );

  const data = await result.json();
  return data;
};
