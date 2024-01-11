import { atoms } from '@theme/atoms.css';
import { style } from '@vanilla-extract/css';

export const itemClass = style([
  atoms({
    backgroundColor: 'semantic.info.default',
    color: 'text.semantic.info.default',
    fontWeight: 'bodyFont.medium',
    padding: 'sm',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'base.boldest',
    borderStyle: 'solid',
    borderWidth: 'hairline',
  }),
]);

export const containerClass = style([
  atoms({
    backgroundColor: 'semantic.warning.default',
    borderColor: 'base.boldest',
    borderStyle: 'solid',
    borderWidth: 'hairline',
    width: '100%',
  }),
]);

export const componentClass = style([
  atoms({
    backgroundColor: 'semantic.positive.default',
    color: 'text.semantic.positive.default',
    borderColor: 'base.boldest',
    borderStyle: 'solid',
    borderWidth: 'hairline',
  }),
]);
