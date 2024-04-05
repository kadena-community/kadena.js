import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { token } from '../../styles';
import { atoms } from '../../styles/atoms.css';
import { iconFill } from './BaseButton/BaseButton.css';

const iconSize = createVar();

export const iconStyle = style({
  fill: iconFill,
  height: iconSize,
  width: iconSize,
  transition: 'fill 0.2s ease-in-out',
});

export const disabledBadgeStyle = style({
  opacity: 0.4,
  transition: 'opacity 0.2s ease-in-out',
});

export const iconOnlyStyle = atoms({
  paddingInline: 'sm',
});

// spacing if there is a leading icon or avatar
const prefixIconSpacing = createVar();
export const prefixIconStyle = style({ marginInlineStart: prefixIconSpacing });

// spacing if there is a trailing icon
const postfixIconSpacing = createVar();
export const postfixIconStyle = style({
  marginInlineEnd: postfixIconSpacing,
});

// spacing if there is a trailing icon
const badgeSpacing = createVar();
export const badgeStyle = style({ marginInlineEnd: badgeSpacing });

// spacing if there is no prefix content
const noPrefixSpacing = createVar();
export const noPrefixStyle = style({ marginInlineStart: noPrefixSpacing });

// spacing if there is no postfix content
const noPostfixSpacing = createVar();
export const noPostfixStyle = style({ marginInlineEnd: noPostfixSpacing });

// spacing if there is an avatar
const avatarSpacing = createVar();
export const avatarStyle = style({
  marginInlineStart: avatarSpacing,
});

export const centerContentWrapper = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'sm',
    flexDirection: 'row',
  }),
  {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
  },
]);

export const directionStyle = style({
  flexDirection: 'row-reverse',
});

export const isCompactStyle = styleVariants({
  true: {
    vars: {
      [iconSize]: token('size.n4'),
      [prefixIconSpacing]: token('size.n3'),
      [postfixIconSpacing]: token('size.n2'),
      [avatarSpacing]: token('size.n3'),
      [badgeSpacing]: token('size.n3'),
      [noPrefixSpacing]: token('size.n4'),
      [noPostfixSpacing]: token('size.n4'),
    },
  },
  false: {
    vars: {
      [iconSize]: token('size.n6'),
      [prefixIconSpacing]: token('size.n4'),
      [postfixIconSpacing]: token('size.n4'),
      [avatarSpacing]: token('size.n5'),
      [badgeSpacing]: token('size.n4'),
      [noPrefixSpacing]: token('size.n6'),
      [noPostfixSpacing]: token('size.n6'),
    },
  },
});
