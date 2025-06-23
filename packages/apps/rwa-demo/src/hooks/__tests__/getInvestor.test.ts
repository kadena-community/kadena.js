import type { IRecord } from '@/utils/filterRemovedRecords';
import { renderHook } from '@testing-library/react-hooks';
import { describe, expect, it } from 'vitest';
import { useGetInvestor } from '../getInvestor';

describe('useGetInvestor', () => {
  it('should return an IRecord with the provided account name', () => {
    // Arrange
    const account = 'test-account';

    // Act
    const { result } = renderHook(() => useGetInvestor({ account }));

    // Assert
    expect(result.current.data).toBeDefined();
    expect(result.current.data.accountName).toBe(account);

    // Verify it conforms to IRecord interface
    const record: IRecord = result.current.data;
    expect(record).toHaveProperty('accountName');
    expect(record.accountName).toBe(account);
  });
});
