export const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const $red = parseInt(hex.substring(0, 2), 16);
  const $green = parseInt(hex.substring(2, 4), 16);
  const $blue = parseInt(hex.substring(4, 6), 16);

  opacity = Math.min(Math.max(opacity, 0), 1);

  return `rgba(${$red}, ${$green}, ${$blue}, ${opacity})`;
};

// eslint-disable-next-line @kadena-dev/typedef-var
export const colorPalette = {
  $white: '#FFFFFF',
  $black: '#000000',

  $gray10: '#FAFAFA',
  $gray20: '#F0F0F0',
  $gray30: '#CACBCE',
  $gray40: '#9EA1A6',
  $gray50: '#768489',
  $gray60: '#474F52',
  $gray70: '#2F3537',
  $gray80: '#252528',
  $gray90: '#1A1A1A',
  $gray100: '#050505',

  $blue10: '#F0F7FF',
  $blue20: '#DBEDFF',
  $blue30: '#CCE6FF',
  $blue40: '#C2E1FF',
  $blue50: '#75BCFF',
  $blue60: '#2997FF',
  $blue70: '#006DD6',
  $blue80: '#00498F',
  $blue90: '#003C75',
  $blue100: '#002F5C',

  $pink10: '#FEE6F4',
  $pink20: '#FDC4E5',
  $pink30: '#FCB0DC',
  $pink40: '#FB93D0',
  $pink50: '#F962BB',
  $pink60: '#ED098F',
  $pink70: '#A30662',
  $pink80: '#710444',
  $pink90: '#63033B',
  $pink100: '#580335',

  $red10: '#FFF1F0',
  $red20: '#FFE7E5',
  $red30: '#FFCCD1',
  $red40: '#FFA8B0',
  $red50: '#FF666A',
  $red60: '#FF3338',
  $red70: '#B81418',
  $red80: '#75000B',
  $red90: '#5C0009',
  $red100: '#410006',

  $yellow10: '#FFF7EB',
  $yellow20: '#FFE7C2',
  $yellow30: '#FFD799',
  $yellow40: '#FFC670',
  $yellow50: '#FFB23D',
  $yellow60: '#FF9900',
  $yellow70: '#CC7A00',
  $yellow80: '#704300',
  $yellow90: '#573705',
  $yellow100: '#3D2500',

  $green10: '#F1FFEB',
  $green20: '#E5FFD8',
  $green30: '#CBFFB3',
  $green40: '#B1FA8F',
  $green50: '#9EF273',
  $green60: '#5EEA15',
  $green70: '#38A300',
  $green80: '#1F6100',
  $green90: '#164200',
  $green100: '#113300',

  $purple10: '#F7EBFF',
  $purple20: '#E7C2FF',
  $purple30: '#DBA3FF',
  $purple40: '#C870FF',
  $purple50: '#B642FF',
  $purple60: '#9D00FF',
  $purple70: '#8300D6',
  $purple80: '#6400A3',
  $purple90: '#450070',
  $purple100: '#320052',
};

export const gradients: {} = {
  gradient1: `linear-gradient(135deg, ${colorPalette.$blue60} 0%, ${colorPalette.$pink60} 100%)`,
  gradient2: `linear-gradient(135deg, ${colorPalette.$blue20} 0%, ${colorPalette.$pink20} 100%)`,
};
