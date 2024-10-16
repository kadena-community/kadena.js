import { FormatAccount } from './FormatAccount';
import { FormatAmount } from './FormatAmount';
import { FormatDefault } from './FormatDefault';
import { FormatLink } from './FormatLink';
import { FormatMultiStepTx } from './FormatMultiStepTx';
import { FormatStatus } from './FormatStatus';

export const CompactTableFormatters = {
  FormatAccount,
  FormatAmount,
  FormatDefault,
  FormatLink,
  FormatMultiStepTx,
  FormatStatus,
} as const;
