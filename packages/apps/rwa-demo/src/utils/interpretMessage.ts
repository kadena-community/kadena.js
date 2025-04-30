import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';

export const interpretMessage = (str: string, data?: ITransaction): string => {
  //error codes in the RWA contract which can be returned by the RWA contract
  if (str?.includes('PAU-001')) {
    return `Contract is already paused.`;
  }
  if (str?.includes('PAU-002')) {
    return `Contract is already unpaused.`;
  }
  if (str?.includes('IDR-001')) {
    return `User is not registered.`;
  }
  if (str?.includes('IDR-002')) {
    return `User must have a zero balance before identity removal.`;
  }
  if (str?.includes('IDR-REC-001')) {
    return `User with balance of 0.0 cannot be recovered.`;
  }
  if (str?.includes('ACC-PRT-001')) {
    return `Reserved protocol guard violation.`;
  }
  if (str?.includes('ACC-PRT-002')) {
    return `Invalid sender or receiver.`;
  }
  if (str?.includes('ACC-FRZ-001')) {
    return `Account is frozen. Partial freeze is not available.`;
  }
  if (str?.includes('ACC-AMT-001')) {
    return `Account has insufficient funds.`;
  }
  if (str?.includes('TRF-ACC-001')) {
    return `Same sender and receiver.`;
  }
  if (str?.includes('TRF-PAUSE-001')) {
    return `Transfer is not permitted because contract is paused.`;
  }
  if (str?.includes('TRF-AMT-002')) {
    return `Transfer amount must be positive.`;
  }
  if (str?.includes('TRF-MGR-001')) {
    return `Managed Transfer Capability balance has exceeded.`;
  }
  if (str?.includes('TRF-CAP-001')) {
    return `Transfer capability was not achieved.`;
  }
  if (str?.includes('FRZ-AMT-002')) {
    return `Frozen amount exceeds available balance.`;
  }
  if (str?.includes('FRZ-AMT-003')) {
    return `Amount to freeze or unfreeze must be positive.`;
  }
  if (str?.includes('FRZ-AMT-004')) {
    return `Amount to unfreeze must be positive.`;
  }
  if (str?.includes('ROL-001')) {
    return `Caller must be either the owner or an agent-admin.`;
  }
  if (str?.includes('ROL-002')) {
    return `Role does not exist in predefined agent roles.`;
  }
  if (str?.includes('ROL-003')) {
    return `Too many roles are added.`;
  }
  if (str?.includes('ROL-STS-001')) {
    return `Agent cannot be added if the agent is already active.`;
  }
  if (str?.includes('ROL-STS-002')) {
    return `Agent is not active.`;
  }
  if (str?.includes('GEN-IMPL-001')) {
    return `Function exists to implement interface, but is not being used.`;
  }
  if (str?.includes('GEN-IMPL-002')) {
    return `Attempted to update value same as the current one.`;
  }
  if (str?.includes('CMPL-MBPI-001')) {
    return `Max-investor-per-balance is invalid.`;
  }
  if (str?.includes('CMPL-MBPI-002')) {
    return `Account balance exceeds max balance per investor after transfer.`;
  }
  if (str?.includes('CMPL-MBPI-003')) {
    return `Account balance exceeds max balance per investor.`;
  }
  if (str?.includes('CMPL-MI-001')) {
    return `Max investors is invalid.`;
  }
  if (str?.includes('CMPL-MI-002')) {
    return `Investor count exceeds max investor after transfer.`;
  }
  if (str?.includes('CMPL-MI-003')) {
    return `Investor count exceeds max investor after mint.`;
  }
  if (str?.includes('CMPL-MI-004')) {
    return `Max investor set below current investor count.`;
  }
  if (str?.includes('CMPL-MI-005')) {
    return `Investor count cannot be below 0.`;
  }
  if (str?.includes('CMPL-SL-001')) {
    return `Supply limit parameter is invalid.`;
  }
  if (str?.includes('CMPL-SL-002')) {
    return `Supply exceeds supply-limit after mint.`;
  }
  if (str?.includes('CMPL-SL-003')) {
    return `Supply limit set below current supply limit.`;
  }
  if (str?.includes('CMPL-DUP-001')) {
    return `Compliance list contains duplicates.`;
  }
  if (str?.includes('BATCH-ARR-001')) {
    return `Input arrays have mismatching lengths.`;
  }

  // misc
  if (str?.includes('Insert: row found for key')) {
    return `${data?.type}: This key already exists`;
  }
  if (str?.includes('buy gas failed')) {
    return `This account does not have enough balance to pay for Gas`;
  }
  if (str?.includes('exceeds max investor')) {
    return `The maximum amount of investors has been reached`;
  }
  if (str?.includes('PactDuplicateTableError')) {
    return `This already exists`;
  }

  if (data?.type) {
    return `${data?.type}: ${str}`;
  }

  return `${str}`;
};
