export const getReturnUrl = (withParams?: boolean) => {
  return `${window.location.protocol}//${window.location.host}${
    window.location.pathname
  }${withParams ? window.location.search : ''}`;
};

export const getReturnHostUrl = () => {
  return `${window.location.protocol}//${window.location.host}`;
};
