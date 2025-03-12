import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { interpretMessage } from '../interpretMessage';

describe('interpretMessage', () => {
  it('should return the default error when no interpert text is found is found', () => {
    const data = {
      type: 'Skeletor',
    } as unknown as ITransaction;
    expect(interpretMessage('There is no error', data)).toEqual(
      'Skeletor: There is no error',
    );

    expect(interpretMessage('There is no error')).toEqual('There is no error');
  });

  it('should return correct text when row is not found', () => {
    const data = {
      type: 'he-man',
    } as unknown as ITransaction;
    expect(
      interpretMessage('This error Insert: row found for key', data),
    ).toEqual('he-man: This key already exists');
  });

  it('should return correct text when buying of gas failed', () => {
    expect(interpretMessage('This error buy gas failed')).toEqual(
      'This account does not have enough balance to pay for Gas',
    );
  });
  it('should return correct text when exceeds max investors', () => {
    expect(interpretMessage('This error exceeds max investor')).toEqual(
      'The maximum amount of investors has been reached',
    );
  });
  it('should return correct text when there is a duplicate in the table', () => {
    expect(
      interpretMessage('This error exceeds PactDuplicateTableError'),
    ).toEqual('This already exists');
  });
  it('should return the correct text when an erorcode is found in the string', () => {
    expect(interpretMessage('This error PAU-001')).toEqual(
      'Contract is already paused.',
    );
    expect(interpretMessage('This error PAU-002')).toEqual(
      'Contract is already unpaused.',
    );
    expect(interpretMessage('This error IDR-001')).toEqual(
      'User is not registered.',
    );
    expect(interpretMessage('This error IDR-002')).toEqual(
      'User must have a zero balance before identity removal.',
    );
    expect(interpretMessage('This error ACC-PRT-001')).toEqual(
      'Single-key account protocol violation.',
    );
    expect(interpretMessage('This error ACC-PRT-002')).toEqual(
      'Reserved protocol guard violation.',
    );
    expect(interpretMessage('This error ACC-PRT-003')).toEqual(
      'Invalid sender or receiver.',
    );
    expect(interpretMessage('This error ACC-FRZ-001')).toEqual(
      'Account is frozen. Partial freeze is not available.',
    );
    expect(interpretMessage('This error ACC-AMT-001')).toEqual(
      'Account has insufficient funds.',
    );
    expect(interpretMessage('This error TRF-ACC-001')).toEqual(
      'Same sender and receiver.',
    );
    expect(interpretMessage('This error TRF-PAUSE-001')).toEqual(
      'Transfer is not permitted because contract is paused.',
    );
    expect(interpretMessage('This error TRF-AMT-002')).toEqual(
      'Transfer amount must be positive.',
    );
    expect(interpretMessage('This error TRF-MGR-001')).toEqual(
      'Managed Transfer Capability balance has exceeded.',
    );
    expect(interpretMessage('This error TRF-CAP-001')).toEqual(
      'Transfer capability was not achieved.',
    );
    expect(interpretMessage('This error FRZ-AMT-002')).toEqual(
      'Frozen amount exceeds available balance.',
    );
    expect(interpretMessage('This error FRZ-AMT-003')).toEqual(
      'Amount to freeze must be positive.',
    );
    expect(interpretMessage('This error FRZ-AMT-004')).toEqual(
      'Amount to unfreeze must be positive.',
    );
    expect(interpretMessage('This error ROL-001')).toEqual(
      'Caller must be either the owner or an agent-admin.',
    );
    expect(interpretMessage('This error ROL-002')).toEqual(
      'Role does not exist in predefined agent roles.',
    );
    expect(interpretMessage('This error ROL-003')).toEqual(
      'Too many roles are added.',
    );
    expect(interpretMessage('This error ROL-STS-001')).toEqual(
      'Agent cannot be added if the agent is already active.',
    );
    expect(interpretMessage('This error ROL-STS-002')).toEqual(
      'Agent is not removed.',
    );
    expect(interpretMessage('This error ROL-STS-003')).toEqual(
      'Agent does not contain the role.',
    );
    expect(interpretMessage('This error GEN-IMPL-001')).toEqual(
      'Function exists to implement interface, but is not being used.',
    );
  });
});
