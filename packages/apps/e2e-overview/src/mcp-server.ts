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

const initializeMcp = async () => {
  const response = await fetch(`http://localhost:8931/mcp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Math.floor(Math.random() * 100000),
      method: 'initialize',
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {
          roots: {},
          sampling: {},
        },
        clientInfo: {
          name: 'ExampleClient',
          version: '1.0.0',
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to initialize MCP: ${response.statusText}`);
  }
  return response.headers.get('mcp-session-id') || '';
};

// Function to execute a tool call via HTTP JSON-RPC
async function executeTool(
  tool: string,
  params: any,
  sessionId: string,
): Promise<any> {
  console.log({ tool, params });
  const response = await fetch(`http://localhost:8931/mcp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'mcp-session-id': sessionId,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Math.floor(Math.random() * 100000),
      method: tool,
      params,
    }),
  });

  // console.log(222, response);
  // if (tool === 'browser_take_screenshot') {
  //   const result = await response.json();
  //   console.log('Screenshot result:', result);
  //   return result;
  // }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  try {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      // Process all complete lines
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line.startsWith('data: ')) {
          const data = line.slice(6); // Remove 'data: ' prefix
          if (data === '[DONE]') {
            console.log('Stream completed');
            continue;
          }
          try {
            const json = JSON.parse(data);
            if (json.error) {
              console.error('Server error:', json.error);
            } else {
              console.log('Result:', json.result);
              return json;
            }
          } catch (e) {
            console.error('Failed to parse JSON:', e, 'Raw data:', data);
          }
        }
      }
      // Keep the last (potentially incomplete) line in the buffer
      buffer = lines[lines.length - 1];
    }
  } catch (error) {
    console.error('Failed to parse JSON:', error);
  }
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
    // const transport = new SSEServerTransport('/messages', res);
    // await mcpConnection.connect(transport);

    // const sessionId = transport.sessionId;

    // Translate NL to MCP tools
    const tools = await translateToMcpTools(command);

    const sessionId = await initializeMcp();
    console.log({ sessionId });

    // Execute each tool call using the HTTP JSON-RPC endpoint
    const results = [];
    const resultImages = [];
    const r = await executeTool('tools/list', {}, sessionId);
    results.push({ tool: 'tools/list', params: {}, result: r });

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
  if (!mcpConnection) {
    await initializeMcpConnection();
  }
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
