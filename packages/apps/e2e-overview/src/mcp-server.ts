import { createOpenAI } from '@ai-sdk/openai';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { generateObject, zodSchema } from 'ai';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
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

const browserTakeScreenshotSchema = z.object({});

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
  z.object({
    tool: z.literal('browser_take_screenshot'),
    params: browserTakeScreenshotSchema,
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
let client: any = null;
async function initializeMcpConnection() {
  try {
    const config = JSON.parse(
      fs.readFileSync('./playwright.mcp.config.json', 'utf8'),
    );

    console.log(config);

    const transport = new StdioClientTransport({
      command: 'npx',
      args: [
        '-y',
        '@playwright/mcp@latest',
        '--isolated',
        '--headless',
        '--browser=chrome',
      ],
    });
    //mcpConnection = await createConnection(config);
    client = new Client(
      { name: 'demo', version: '0.1', ...config },
      { capabilities: {} },
    );
    await client.connect(transport);
    await client.listTools();

    //mcpConnection = await createConnection(config);
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
    - browser_click: { element: string, ref: string } (use exact ref from browser_snapshot, e.g., 'e4')
    - browser_type: { element: string, ref: string, text: string } (use exact ref from browser_snapshot)
    - browser_snapshot: {} (returns accessibility tree, must be called before browser_click or browser_type)
    - browser_take_screenshot: {} (captures viewport screenshot)
    Steps:
    1. Always include a "browser_snapshot" call after "browser_navigate" or when elements need to be identified.
    2. For "browser_click" or "browser_type", use the exact "ref" from the snapshot (e.g., 'e4', 'e5') instead of CSS selectors.
    3. If waiting for dynamic content is needed, include a "browser_wait_for" call with appropriate text or timeout.
    4. Include a final "browser_take_screenshot" to capture the end state.
    Example output:
    {
      "tools": [
        { "tool": "browser_navigate", "params": { "url": "https://example.com" } },
        { "tool": "browser_snapshot", "params": {} },
        { "tool": "browser_click", "params": { "element": "Login button", "ref": "e4" } },
        { "tool": "browser_take_screenshot", "params": {} }
      ]
    }
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
  console.log({ tool, params });

  const r = await client.callTool({
    name: tool,
    arguments: params,
  });

  console.log(r.content);
  return r;
}

// API endpoint for NL commands
app.post('/automate', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    // Ensure MCP connection is initialized
    if (!client) {
      await initializeMcpConnection();
    }

    console.log('Playwright MCP connection initialized');

    // Translate NL to MCP tools
    const tools = await translateToMcpTools(command);

    const sessionId = 'demo-session'; // Placeholder, replace with actual session ID if needed

    // Execute each tool call using the HTTP JSON-RPC endpoint
    const results = [];

    for (const toolCall of tools) {
      const { tool, params } = toolCall;

      const result = await executeTool(tool, params, sessionId);
      results.push({ tool, params, result });
    }

    const result = await executeTool('browser_close', {}, sessionId);
    results.push({ tool: 'browser_close', params: {}, result });

    res.json({
      success: true,
      results,
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
  if (!client) {
    await initializeMcpConnection();
  }
  console.log(`MCP Server running on http://localhost:${PORT}/automate`);
  // Initialize MCP connection on server start
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down MCP server...');
  if (client) {
    await client.close();
  }
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
