import * as v from 'valibot';

const responseSuccessSchema = v.object({
  status: v.literal('success'),
  data: v.string(),
});

const responseErrorSchema = v.object({
  status: v.literal('failure'),
  error: v.object({
    type: v.string(),
    message: v.string(),
    info: v.optional(v.string()),
    callStack: v.optional(v.array(v.string())),
  }),
});

const responseResultSchema = v.union([
  responseSuccessSchema,
  responseErrorSchema,
]);
export type ResponseResult = v.InferOutput<typeof responseResultSchema>;

export const responseSchema = v.object({
  gas: v.number(),
  result: responseResultSchema,
  reqKey: v.string(),
  logs: v.string(),
  continuation: v.any(), // seen: "null"
  txId: v.nullable(v.string()), // seen: "null"
  // Fallback for metaData and events, prioritize having access to result
  metaData: v.optional(
    v.object({
      blockTime: v.number(),
      prevBlockHash: v.string(),
      blockHash: v.string(),
      blockHeight: v.number(),
    }),
  ),
  events: v.optional(
    v.array(
      v.object({
        params: v.array(v.union([v.string(), v.number()])),
        name: v.string(),
        module: v.object({
          namespace: v.any(), // seen: "null"
          name: v.string(),
        }),
        moduleHash: v.string(),
      }),
    ),
  ),
});

export const pollResponseSchema = v.record(v.string(), responseSchema);
export type PollResponse = v.InferOutput<typeof pollResponseSchema>;
