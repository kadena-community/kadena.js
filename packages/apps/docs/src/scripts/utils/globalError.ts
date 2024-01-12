let globalError = false;

export const setGlobalError = (v: boolean) => {
  globalError = v;
};

export const getGlobalError = () => globalError;
