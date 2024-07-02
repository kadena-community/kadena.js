import { style, token } from '../../../styles';

export const comboBoxControlClass = style({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: token('color.background.input.default'),
  border: 'none',
  color: token('color.text.base.default'),
  outline: 'none',
  flex: 1,
  overflow: 'hidden',
});
