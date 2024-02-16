export const getReturnUrl = () => {
  return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
};

export const getReturnHostUrl = () => {
  return `${window.location.protocol}//${window.location.host}`;
};
