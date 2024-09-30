import { atoms, style, token } from './../../styles';

export const contextMenuClass = style([
  atoms({
    position: 'absolute',
    borderStyle: 'solid',
    borderRadius: 'sm',
    borderWidth: 'hairline',
  }),
  {
    borderColor: token('color.neutral.n1@alpha80'),
    backgroundColor: token('color.neutral.n20@alpha80'),
  },
]);
