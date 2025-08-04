import { z } from 'zod';

export interface IRPCError {
  code: number;
  message: string;
  data?: any;
}

export function isRpcError(e: any): e is IRPCError {
  return (
    e !== null &&
    typeof e === 'object' &&
    typeof e.code === 'number' &&
    typeof e.message === 'string'
  );
}

/**
 * Shared error schema (JSON-RPC 2.0 error)
 */
const errorSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number(),
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.optional(z.unknown()),
  }),
});

/**
 * kadena_getAccount_v1 => single AccountInfo
 */
const accountInfoSchema = z.object({
  accountName: z.string(),
  networkId: z.string(),
  contract: z.string(),
  guard: z.object({
    keys: z.array(z.string()),
    pred: z.string(),
  }),
  existsOnChains: z.array(z.string()),
  keyset: z.object({
    keys: z.array(z.string()),
    pred: z.string(),
  }),
});

/**
 * kadena_getAccounts_v2 => array of AccountInfo
 */
const accountsInfoSchema = z.array(accountInfoSchema);

/**
 * kadena_getNetwork_v1 => single NetworkInfo
 * kadena_changeNetwork_v1 => single NetworkInfo
 */
const networkInfoSchema = z.object({
  networkName: z.string(),
  networkId: z.string(),
  // wallet can optionally return no URLs, or multiple
  url: z.array(z.string()),
});

/**
 * kadena_getNetworks_v1 => array of NetworkInfo
 */
const networksInfoSchema = z.array(networkInfoSchema);

/**
 * kadena_signCommand / kadena_signTransaction => typically returns `ICommand`:
 * { cmd: string, hash: string, sigs: Array<{sig?: string}> }
 */
const commandSchema = z.object({
  cmd: z.string(),
  hash: z.string(),
  sigs: z.array(
    z.object({
      sig: z.string().optional().nullable(),
    }),
  ),
});

/**
 * Validate the final JSON-RPC response for each method. If there's an "error"
 * property, we parse it against the errorSchema. Otherwise we parse it with
 * the appropriate schema.
 *
 * @param method  The method name we called (e.g. "kadena_getAccount_v1")
 * @param response The raw JSON response from the wallet
 * @returns An object indicating success/failure and any validation errors.
 */
export function validateRpcResponse(method: string, response: any) {
  if (!response || typeof response !== 'object') {
    return {
      success: false,
      issues: [`Response is not an object; got: ${typeof response}`],
    };
  }

  // Check if it's an error response first
  if ('error' in response) {
    const errCheck = errorSchema.safeParse(response);
    if (!errCheck.success) {
      // It's an invalid error format
      return {
        success: false,
        issues: errCheck.error.format(),
      };
    }
    // Valid error object
    return {
      success: true,
      isError: true,
    };
  }

  switch (method) {
    case 'kadena_getAccount_v1': {
      const parsed = accountInfoSchema.safeParse(response);
      if (!parsed.success) {
        return { success: false, issues: parsed.error.format() };
      }
      return { success: true };
    }

    case 'kadena_getAccounts_v2': {
      const parsed = accountsInfoSchema.safeParse(response);
      if (!parsed.success) {
        return { success: false, issues: parsed.error.format() };
      }
      return { success: true };
    }

    case 'kadena_getNetwork_v1': {
      const parsed = networkInfoSchema.safeParse(response);
      if (!parsed.success) {
        return { success: false, issues: parsed.error.format() };
      }
      return { success: true };
    }

    case 'kadena_getNetworks_v1': {
      const parsed = networksInfoSchema.safeParse(response);
      if (!parsed.success) {
        return { success: false, issues: parsed.error.format() };
      }
      return { success: true };
    }

    case 'kadena_changeNetwork_v1': {
      const parsed = networkInfoSchema.safeParse(response);
      if (!parsed.success) {
        return { success: false, issues: parsed.error.format() };
      }
      return { success: true };
    }

    case 'kadena_signCommand': {
      const parsed = commandSchema.safeParse(response);
      if (!parsed.success) {
        return { success: false, issues: parsed.error.format() };
      }
      return { success: true };
    }

    case 'kadena_signTransaction': {
      const parsed = commandSchema.safeParse(response);
      if (!parsed.success) {
        return { success: false, issues: parsed.error.format() };
      }
      return { success: true };
    }

    default:
      // If we haven’t defined a schema for this method, skip validation
      return { success: true, note: 'No specific validation for this method' };
  }
}
