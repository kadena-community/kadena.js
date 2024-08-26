export type IErrors = Record<string, string>;
export type IValues = Record<string, string | undefined>;

export const validateChains = (
  chains: string | undefined,
  errors: IErrors,
): IErrors => {
  const chainRegExp = new RegExp(/^\d+(?:\s*,\s*\d+)*\s*,?$/);
  if (chains?.length && !chains?.match(chainRegExp)) {
    return {
      ...errors,
      chains: 'Only numbers or a comma separated string of numbers',
    };
  } else {
    const newErrors = { ...errors };
    delete newErrors.chains;
    return newErrors;
  }
};

export const validateHeight = (
  label: string,
  value: string | undefined,
  errors: IErrors,
): IErrors => {
  const valueInt = value && parseInt(value, 10);
  if (value && (Number.isNaN(valueInt) || (valueInt && valueInt < 0))) {
    return {
      ...errors,
      [label]: 'Only numbers',
    };
  } else {
    const newErrors = { ...errors };
    delete newErrors[label];
    return newErrors;
  }
};

export const validateMinLesserThanMax = (
  label: string,
  minVal: string | undefined,
  maxVal: string | undefined,
  errors: IErrors,
): IErrors => {
  if (minVal && maxVal && parseInt(minVal) > parseInt(maxVal)) {
    return {
      ...errors,
      maxHeight: 'Height min. can not be larger than the Height max',
    };
  }

  return errors;
};

export const validate = (errors: IErrors, values: IValues): IErrors => {
  let newErrors = validateChains(values.chains, errors);
  newErrors = validateHeight('maxHeight', values.maxHeight, newErrors);
  newErrors = validateHeight('minHeight', values.minHeight, newErrors);
  newErrors = validateMinLesserThanMax(
    'minHeight',
    values.minHeight,
    values.maxHeight,
    newErrors,
  );

  return newErrors;
};
