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
    const detailedOption = result({ isOptional: true });
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

    const detailedOption = result({ isOptional: true });
    await detailedOption.expand('label');
    expect(mockExpand).toHaveBeenCalledWith('label');
  });

  it('should apply correct Zod validation based on optional flag', async () => {
    const validationSchema = z.string();
    const testOption = new Option('-t, --test <test>', 'test option');

    let result = createOption({
      prompt: async () => 'test',
      validation: validationSchema,
      option: testOption,
    });
    let detailedOption = result({ isOptional: false });
    expect(JSON.stringify(detailedOption.validation)).toBe(
      JSON.stringify(validationSchema),
    );

    result = createOption({
      prompt: async () => 'test',
      validation: validationSchema,
      option: testOption,
    });
    detailedOption = result({ isOptional: true });
    expect(JSON.stringify(detailedOption.validation)).toBe(
      JSON.stringify(validationSchema.optional()),
    );
  });

  it('should correctly handle the isOptional parameter in the prompt', async () => {
    const mockPrompt = vi.fn();
    const testOption = new Option('-t, --test <test>', 'test option');

    const result = createOption({
      prompt: mockPrompt,
      validation: z.string(),
      option: testOption,
    });

    const detailedOption = result({ isOptional: true });
    await detailedOption.prompt({}, {}, true);
    expect(mockPrompt).toHaveBeenCalledWith({}, {}, true);

    const detailedOptionFalse = result({ isOptional: false });
    await detailedOptionFalse.prompt({}, {}, false);
    expect(mockPrompt).toHaveBeenCalledWith({}, {}, false);
  });
});

describe('createOption with transform', () => {
  it('should apply transform function to the option value', async () => {
    const mockTransform = vi
      .fn()
      .mockImplementation((value) => `transformed-${value}`);
    const testOption = new Option('-t, --test <test>', 'test option');
    const inputValue = 'inputValue';

    const optionCreator = {
      prompt: async () => inputValue,
      validation: z.string(),
      option: testOption,
      transform: mockTransform,
    };

    const result = createOption(optionCreator);
    const detailedOption = result({ isOptional: false });

    const transformedValue = await detailedOption.transform(inputValue);

    expect(mockTransform).toHaveBeenCalledWith(inputValue);
    expect(transformedValue).toBe(`transformed-${inputValue}`);
  });
});
