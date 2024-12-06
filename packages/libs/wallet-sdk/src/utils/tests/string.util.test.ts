import { describe, expect, it } from 'vitest';
import { safeJsonParse } from '../string.util.js';

interface IUser {
  name: string;
  age: number;
}

interface IUserDetails {
  age: number;
  city: string;
}

interface INestedUser {
  user: {
    name: string;
    details: IUserDetails;
  };
}

describe('safeJsonParse', () => {
  it('should parse a valid JSON string and return the correct object', () => {
    const jsonString = '{"name": "Alice", "age": 30}';

    const result = safeJsonParse<IUser>(jsonString);

    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  it('should return null for an invalid JSON string', () => {
    const invalidJsonString = '{"name": "Alice", "age": 30'; // Missing closing brace
    const result = safeJsonParse<IUser>(invalidJsonString);

    expect(result).toBeNull();
  });

  it('should return null when the input is null', () => {
    const result = safeJsonParse<null>(null);

    expect(result).toBeNull();
  });

  it('should return null when the input is undefined', () => {
    const result = safeJsonParse<undefined>(undefined);

    expect(result).toBeNull();
  });

  it('should correctly parse a JSON array', () => {
    const jsonArray = '["apple", "banana", "cherry"]';
    type Fruits = string[];
    const result = safeJsonParse<Fruits>(jsonArray);

    expect(result).toEqual(['apple', 'banana', 'cherry']);
  });

  it('should return null when JSON.parse throws an error', () => {
    const malformedJson = '{"name": "Bob", "age":}';
    const result = safeJsonParse<IUser>(malformedJson);

    expect(result).toBeNull();
  });

  it('should parse nested JSON objects correctly', () => {
    const nestedJson =
      '{"user": {"name": "Charlie", "details": {"age": 25, "city": "New York"}}}';

    const result = safeJsonParse<INestedUser>(nestedJson);

    expect(result).toEqual({
      user: {
        name: 'Charlie',
        details: {
          age: 25,
          city: 'New York',
        },
      },
    });
  });

  it('should handle empty JSON objects', () => {
    const emptyJson = '{}';
    const result = safeJsonParse<Record<string, never>>(emptyJson);

    expect(result).toEqual({});
  });

  it('should handle empty JSON arrays', () => {
    const emptyArrayJson = '[]';
    const result = safeJsonParse<unknown[]>(emptyArrayJson);

    expect(result).toEqual([]);
  });
});
