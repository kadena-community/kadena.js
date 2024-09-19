import { InternalError, InvalidParamsError } from '@metamask/snaps-sdk';

type DefinitionValue = "string" | "number" | "boolean" | "object";

export interface ValidateDefinition {
  [key: string]: DefinitionValue
}

type Obj = Record<string, unknown>

export function makeValidator<T extends Obj>(def: ValidateDefinition): (obj: T) => void {
  return obj => validateParams(def, obj);
}

export function validateParams<T extends Obj>(def: ValidateDefinition, obj: T): void {
  const errors = [];
  for(const [key, expectedType] of Object.entries(def)) {
    if (!(validateField(obj[key], expectedType))) {
      errors.push(key);
    }
  }

  if (errors.length) {
    const fieldMessage = errors.map(key => {
      const expectedType = def[key];
      const suffix = expectedType.endsWith('[]') ? '' : ` received ${typeof obj[key]}`;
      return `"${key}: expected ${expectedType}${suffix}"`
    }).join(', ');

    const prefix = `${errors.length} parameter validation error${errors.length > 1 ? 's':''}: `;

    throw new InvalidParamsError(`${prefix}${fieldMessage}`);
  }
}

function validateField(value: unknown, defValue: DefinitionValue) {
  switch(defValue) {
    case 'boolean':
      return validateBoolean(value);
    case 'number':
      return validateNumber(value);
    case 'string':
      return validateString(value);
    case 'object':
      return validateObject(value);
    default:
      throw new InternalError(`Unexpected validation type: ${defValue}`);
  }
}

function validateBoolean(n: unknown): n is boolean {
  return typeof n === "boolean";
}

function validateNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function validateString(s: unknown): s is string {
  return typeof s === "string";
}

function validateObject(arr: unknown): arr is object {
  return typeof arr === "object" && arr !== null;
}
