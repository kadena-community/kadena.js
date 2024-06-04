import { atoms, token, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  atoms({ display: 'grid', height: '100%' }),
  {
    gridTemplateColumns: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.size.n16}) 1fr`, // 20rem 1fr
  },
]);

export const placeholderBodyStyles = style([
  atoms({ textAlign: 'center' }),
  { width: token('size.n64') },
]);

export const statusbarStyles = style({ borderBlock: token('border.hairline') });

export const hashBadgeStyles = atoms({
  paddingInline: 'xs',
  paddingBlock: 'n0',
});

export const chainBadgeStyles = style({ whiteSpace: 'nowrap' });

export const tabsLabelStyles = style({ whiteSpace: 'nowrap' });

export const firstLevelTabPanelStyles = atoms({
  backgroundColor: 'surface.default',
});

export const secondLevelTabPanelStyles = style({ marginBlock: 0 });
