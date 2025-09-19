import { createOpenAI } from '@ai-sdk/openai';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createConnection } from '@playwright/mcp';
import { generateObject, zodSchema } from 'ai';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import * as z from 'zod';

// Initialize Express and middleware
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

// Define schemas for each tool's params
const browserNavigateParamsSchema = z
  .object({
    url: z.string().url('Must be a valid URL'),
  })
  .strict();

const browserClickParamsSchema = z
  .object({
    element: z.string().min(1, 'Element selector is required'),
    ref: z.string().min(1, 'Element ref is required'),
  })
  .strict();

const browserTypeParamsSchema = z
  .object({
    element: z.string().min(1, 'Element selector is required'),
    ref: z.string().min(1, 'Element ref is required'),
    text: z.string().min(1, 'Text to type is required'),
  })
  .strict();

const browserSnapshotParamsSchema = z.object({}).strict();

// Define the tool call schema with discriminated union based on 'tool'
const mcpToolCallSchema = z.discriminatedUnion('tool', [
  z.object({
    tool: z.literal('browser_navigate'),
    params: browserNavigateParamsSchema,
  }),
  z.object({
    tool: z.literal('browser_click'),
    params: browserClickParamsSchema,
  }),
  z.object({
    tool: z.literal('browser_type'),
    params: browserTypeParamsSchema,
  }),
  z.object({
    tool: z.literal('browser_snapshot'),
    params: browserSnapshotParamsSchema,
  }),
]);

// The overall schema for the array of tool calls
const mcpToolCallsSchema = z.object({
  tools: z.array(mcpToolCallSchema),
});

// Initialize AI SDK with OpenAI provider
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a persistent Playwright MCP connection
let mcpConnection: any = null;
async function initializeMcpConnection() {
  try {
    mcpConnection = await createConnection({
      browser: {
        browserName: 'chromium',
        launchOptions: { headless: false },
      },
      server: {
        port: 8931,
        host: 'localhost',
      },
    });
  } catch (error) {
    console.error('Failed to initialize MCP connection:', error);
    throw error;
  }
}

// Translate NL to MCP tool calls using AI SDK
async function translateToMcpTools(nlCommand: string): Promise<any> {
  const prompt = `
    You are an expert at translating natural language commands into Playwright MCP tool calls.
    Output ONLY a JSON object with a single property "tools", which is an array of objects, each with "tool" and "params" properties.
    Available tools:
    - browser_navigate: { url: string }
    - browser_click: { element: string, ref: string } (CSS selector or accessibility ref)
    - browser_type: { element: string, ref: string, text: string }
    - browser_snapshot: {} (returns accessibility tree)
    - browser_take_screenshot: {} (Capture accessibility snapshot of the current page, this is better than screenshot)
    Example output: { "tools": [ { "tool": "browser_navigate", "params": { "url": "https://example.com" } } ] }
    For actions like browser_click and browser_type, include a placeholder "ref" field (e.g., "placeholder-ref") as it will be resolved later.
    Command: ${nlCommand}
  `;

  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: zodSchema(mcpToolCallsSchema),
    system: 'You are a precise JSON generator.',
    prompt,
  });

  if (!object) throw new Error('No response from AI SDK');
  return mcpToolCallsSchema.parse(object).tools;
}

// Function to execute a tool call via HTTP JSON-RPC
async function executeTool(
  tool: string,
  params: any,
  sessionId: string,
): Promise<any> {
  const response = await fetch(
    `http://localhost:8931/sse?sessionId=${encodeURIComponent(sessionId)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Math.floor(Math.random() * 100000),
        method: tool,
        params,
      }),
    },
  );

  // if (tool === 'browser_take_screenshot') {
  //   const result = await response.json();
  //   console.log('Screenshot result:', result);
  //   return result;
  // }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // `value` is a Uint8Array (a view of the underlying ArrayBuffer)
    if (value instanceof Uint8Array) {
      chunks.push(value);
    } else {
      throw new Error('Unexpected chunk type received');
    }
  }

  // Combine all chunks into a single ArrayBuffer
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  // Return the combined buffer as an ArrayBuffer or Uint8Array
  return result.buffer; // or `return result;` if you want Uint8Array
}

// API endpoint for NL commands
app.post('/automate', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    // Ensure MCP connection is initialized
    if (!mcpConnection) {
      await initializeMcpConnection();
    }

    console.log('Playwright MCP connection initialized');
    const transport = new SSEServerTransport('/messages', res);
    await mcpConnection.connect(transport);

    const sessionId = transport.sessionId;

    // Translate NL to MCP tools
    const tools = await translateToMcpTools(command);

    // Execute each tool call using the HTTP JSON-RPC endpoint
    const results = [];
    const resultImages = [];
    for (const toolCall of tools) {
      const { tool, params } = toolCall;

      //try {
      const result = await executeTool(tool, params, sessionId);
      results.push({ tool, params, result });

      const resultImage = await executeTool(
        'browser_take_screenshot',
        {
          raw: false,
          fullPage: true,
        },
        sessionId,
      );

      resultImages.push({ tool, params, result: resultImage });
      // } catch (error) {
      //   console.error(`Error executing tool ${tool}:`, error);
      //   results.push({ tool, params, error: (error as Error).message });
      // }
    }

    res.json({
      success: true,
      results,
      resultImages,
    });
  } catch (error) {
    console.error('Error in /automate:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Start server
const server = http.createServer(app);
const PORT = process.env.MCP_SERVER_PORT || 3002;
server.listen(PORT, async () => {
  console.log(`MCP Server running on http://localhost:${PORT}/automate`);
  // Initialize MCP connection on server start
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down MCP server...');
  if (mcpConnection) {
    await mcpConnection.close();
  }
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
