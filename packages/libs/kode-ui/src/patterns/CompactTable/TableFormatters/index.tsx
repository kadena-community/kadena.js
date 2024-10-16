import { FormatAccount } from './FormatAccount';
import { FormatAmount } from './FormatAmount';
import { FormatDefault } from './FormatDefault';
import { FormatJsonParse } from './FormatJsonParse';
import { FormatLink } from './FormatLink';
import { FormatMultiStepTx } from './FormatMultiStepTx';
import { FormatStatus } from './FormatStatus';
import type {
  ICompactTableFormatterLinkProps,
  ICompactTableFormatterProps,
} from './types';

export const CompactTableFormatters = {
  FormatAccount,
  FormatAmount,
  FormatDefault,
  FormatLink,
  FormatMultiStepTx,
  FormatJsonParse,
  FormatStatus,
} as const;

export { ICompactTableFormatterLinkProps, ICompactTableFormatterProps };
