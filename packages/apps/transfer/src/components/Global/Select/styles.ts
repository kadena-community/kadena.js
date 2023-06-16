import { styled, Text } from '@kadena/react-components';

// eslint-disable-next-line @kadena-dev/typedef-var
export const styleVariant = {
  neutral: {
    $$color: '$colors$foreground',
    $$accentColor: '$colors$foreground',
    $$borderColor: '$colors$borderColor',
    $$tagBg: '$colors$foreground',
    $$tagColor: '$colors$background',
    $$background: '$colors$background',
  },
  success: {
    $$color: '$colors$foreground',
    $$accentColor: '$colors$positiveAccent',
    $$borderColor: '$colors$positiveAccent',
    $$tagBg: '$colors$foreground',
    $$tagColor: '$colors$background',
    $$background: '$colors$background',
  },
  error: {
    $$color: '$colors$foreground',
    $$accentColor: '$colors$negativeAccent',
    $$borderColor: '$colors$negativeAccent',
    $$tagBg: '$colors$foreground',
    $$tagColor: '$colors$background',
    $$background: '$colors$background',
  },
  disabled: {
    $$color: '$colors$neutral3',
    $$accentColor: '$colors$neutral3',
    $$borderColor: '$colors$borderColor',
    $$tagBg: '$colors$neutral3',
    $$tagColor: '$colors$background',
    $$background: '$colors$neutral2',
  },
};

export const StyledSelectGroupWrapper = styled('div', {
  color: '$$color',

  variants: {
    variant: styleVariant,
  },
  defaultVariants: {
    variant: 'neutral',
  },
});

export const StyledSelectGroupHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  pb: '$2',
});

export const StyledTag = styled('span', {
  ml: '$4',
  backgroundColor: '$$tagBg',
  color: '$$tagColor',
  borderRadius: '$xs',
  py: '$1',
  px: '$2',
  display: 'inline-block',
  fontSize: '$xs',
  lineHeight: '$base',
  fontWeight: '$medium',

  variants: {
    variant: styleVariant,
  },
  defaultVariants: {
    variant: 'neutral',
  },
});

export const StyledInfo = styled('span', {
  marginLeft: 'auto',
  fontSize: '$xs',
  display: 'flex',
  alignItems: 'center',
  '> span': {
    pr: '$1',
  },
});

export const StyledHelper = styled('span', {
  mt: '$4',
  display: 'flex',
  alignItems: 'center',
  fontSize: '$xs',
  '> span': {
    pl: '$2',
  },

  '& > svg': {
    color: '$$accentColor',
  },

  variants: {
    variant: styleVariant,
  },
  defaultVariants: {
    variant: 'neutral',
  },
});

export const StyledSelectWrapper = styled('div', {
  backgroundColor: '$$background',
  display: 'flex',
  borderRadius: '$sm',
  borderBottom: '1px solid $$borderColor',
  color: '$$color',
  height: '$12',
  alignItems: 'center',
  lineHeight: '$code',
  borderColor: '$$accentColor',
  '*': {
    color: 'inherit',
  },

  variants: {
    variant: styleVariant,
  },
  defaultVariants: {
    variant: 'neutral',
  },
});

export const StyledLeadingText = styled('span', {
  px: '$4',
  py: '$2',
  backgroundColor: '$neutral2',
  borderTopLeftRadius: '$sm',
  borderBottomLeftRadius: '$sm',
  height: '100%',
  '& + *': {
    px: '$4',
  },
});

export const StyledIconWrapper = styled('span', {
  px: '$4',
  py: '$2',
  fontSize: '$base',
  '& + *': {
    pl: '0',
  },
});

export const StyledSelect = styled('select', {
  background: 'none',
  px: '$4',
  border: 'none',
  flex: '1',
  outline: 'none',
  fontSize: 'inherit',
  color: '$$color',

  variants: {
    variant: styleVariant,
  },
  defaultVariants: {
    variant: 'neutral',
  },
});

export const StyledText = styled(Text, {
  color: '$$color',
});

export const StyledOption = styled('option', {
  backgroundColor: '$$background',
});

export const StyledSelects = styled('div', {
  '& > *': {
    borderRadius: '0',
    '&:first-child': {
      borderTopRightRadius: '$sm',
      borderTopLeftRadius: '$sm',
    },
    '&:last-child': {
      borderBottomRightRadius: '$sm',
      borderBottomLeftRadius: '$sm',
    },
  },
});
