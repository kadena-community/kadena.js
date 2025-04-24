import {
  ITransaction,
  TransactionStatus,
} from '@/modules/transaction/transaction.repository';
import { failureClass, pendingClass, successClass } from '../style.css';

export const steps: TransactionStatus[] = [
  'initiated',
  'signed',
  'preflight',
  'submitted',
  'failure',
  'success',
  'persisted',
];

export const statusPassed = (
  txStatus: ITransaction['status'],
  status: ITransaction['status'],
) => steps.indexOf(txStatus) >= steps.indexOf(status);

export const getStatusClass = (status: ITransaction['status']) => {
  if (statusPassed(status, 'success')) return successClass;
  if (status === 'failure') return failureClass;
  if (status === 'initiated') return '';
  return pendingClass;
};
