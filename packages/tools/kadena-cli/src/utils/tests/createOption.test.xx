import { Option } from 'commander';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { createOption } from '../createOption.js';

describe('createOption', () => {
  it('should create a basic option', async () => {
    const mockPrompt = vi.fn();
    const mockValidation = {
      optional: vi.fn().mockReturnValue('optionalValidation'),
    };
    const testOption = new Option('-t, --test <test>', 'test option');

    const result = createOption({
      prompt: mockPrompt,
      validation: mockValidation,
      option: testOption,
    });

    expect(result).toBeInstanceOf(Function);
    const detailedOption = result(true);
    expect(detailedOption).toHaveProperty('option', testOption);
    expect(detailedOption).toHaveProperty('validation', 'optionalValidation');
    expect(detailedOption).toHaveProperty('prompt');

    await detailedOption.prompt();
    expect(mockPrompt).toHaveBeenCalled();
  });

  it('should handle expand functionality', async () => {
    const mockExpand = vi.fn();
    const testOption = new Option('-t, --test <test>', 'test option');

    const result = createOption({
      prompt: async () => 'test',
      validation: { optional: vi.fn().mockReturnValue('optionalValidation') },
      option: testOption,
      expand: mockExpand,
    });

    const detailedOption = result(true);
    await detailedOption.expand('label');
    expect(mockExpand).toHaveBeenCalledWith('label');
  });

  it('should handle multiple dependencies', async () => {
    const mockAction1 = vi.fn();
    const mockAction2 = vi.fn();
    const mockCondition1 = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);
    const mockCondition2 = vi.fn().mockResolvedValue(true);
    const testOption = new Option('-t, --test <test>', 'test option');

    const result = createOption({
      prompt: async () => 'test',
      validation: { optional: vi.fn().mockReturnValue('optionalValidation') },
      option: testOption,
      dependsOn: [
        {
          condition: mockCondition1,
          action: mockAction1,
          message: 'First dependency required',
        },
        {
          condition: mockCondition2,
          action: mockAction2,
          message: 'Second dependency required',
        },
      ],
    });

    const detailedOption = result(true);
    await detailedOption.prompt();
    expect(mockCondition1).toHaveBeenCalledTimes(2);
    expect(mockAction1).toHaveBeenCalledTimes(1);
    expect(mockCondition2).toHaveBeenCalledTimes(1);
    expect(mockAction2).not.toHaveBeenCalled();
  });

  it('should apply correct Zod validation based on optional flag', async () => {
    const validationSchema = z.string();
    const testOption = new Option('-t, --test <test>', 'test option');

    let result = createOption({
      prompt: async () => 'test',
      validation: validationSchema,
      option: testOption,
    });
    let detailedOption = result(false);
    expect(JSON.stringify(detailedOption.validation)).toBe(
      JSON.stringify(validationSchema),
    );

    result = createOption({
      prompt: async () => 'test',
      validation: validationSchema,
      option: testOption,
    });
    detailedOption = result(true);
    expect(JSON.stringify(detailedOption.validation)).toBe(
      JSON.stringify(validationSchema.optional()),
    );
  });
});
