const getRequiredParams = (
  searchParams: string,
  removeParams: string[],
): string => {
  const innerSearchParams = new URLSearchParams(searchParams);

  removeParams.forEach((key) => {
    if (innerSearchParams.has(key)) {
      innerSearchParams.delete(key);
    }
  });
  return `?${innerSearchParams.toString()}`;
};

export const getReturnUrl = (removeParams?: string[]) => {
  return `${window.location.protocol}//${window.location.host}${
    window.location.pathname
  }${
    removeParams ? getRequiredParams(window.location.search, removeParams) : ''
  }`;
};

export const getReturnHostUrl = () => {
  return `${window.location.protocol}//${window.location.host}`;
};
