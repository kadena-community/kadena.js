import { FormatAccount } from './FormatAccount';
import { FormatActions } from './FormatActions';
import { FormatAmount } from './FormatAmount';
import { FormatDefault } from './FormatDefault';
import { FormatJsonParse } from './FormatJsonParse';
import { FormatLink } from './FormatLink';
import { FormatLinkWrapper } from './FormatLinkWrapper';
import { FormatMultiStepTx } from './FormatMultiStepTx';
import { FormatStatus } from './FormatStatus';
import type {
  ICompactTableFormatterLinkProps,
  ICompactTableFormatterProps,
} from './types';

export const CompactTableFormatters = {
  FormatAccount,
  FormatActions,
  FormatAmount,
  FormatDefault,
  FormatLink,
  FormatMultiStepTx,
  FormatJsonParse,
  FormatStatus,
  FormatLinkWrapper,
} as const;

export { ICompactTableFormatterLinkProps, ICompactTableFormatterProps };
