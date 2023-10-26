// eslint-disable-next-line @kadena-dev/no-eslint-disable
/* eslint-disable @kadena-dev/typedef-var */

const defaultOptions = {
  character: '*',
  maskLength: 4,
  headLength: 6,
  tailLength: 4,
};

type MaskOptions = typeof defaultOptions;

export const maskValue = (
  value: string,
  options?: Partial<MaskOptions>,
): string => {
  const {
    character,
    maskLength: _maskLength,
    headLength: _headLength,
    tailLength: _tailLength,
  } = {
    ...defaultOptions,
    ...options,
  };

  if (character.length > 1) {
    throw new Error('Only one character is allowed');
  }

  const maskLength = Math.max(0, _maskLength);
  const headLength = Math.max(0, _headLength);
  const tailLength = Math.max(0, _tailLength);

  if (headLength + tailLength >= value.length) {
    return value;
  }

  if (maskLength >= value.length) {
    return character.repeat(value.length);
  }

  const leftHandSide = value.slice(0, headLength);
  const rightHandSide = value.slice(-tailLength);
  const restLength = value.length - (headLength + tailLength);

  const mask = character.repeat(Math.min(restLength, maskLength));

  return `${leftHandSide}${mask}${rightHandSide}`;
};
