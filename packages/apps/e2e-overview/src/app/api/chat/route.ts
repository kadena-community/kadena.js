import { createOpenAI, openai } from '@ai-sdk/openai';
import type { ModelMessage } from 'ai';
import {
  convertToModelMessages,
  generateText,
  StreamingTextResponse,
  streamText,
} from 'ai';
// import { spawn } from 'child_process';
import { NextResponse } from 'next/server';

import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createConnection } from '@playwright/mcp';

// Initialize AI SDK with OpenAI provider
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Replace with your OpenAI API key or use env var
});

// function startMCPServer() {
//   return spawn('npx', ['@playwright/mcp'], { stdio: 'pipe' });
// }

// Translate NL to MCP tool calls using AI SDK
async function translateToMcpTools(nlCommand: string): Promise<any[]> {
  const prompt = `
    You are an expert at translating natural language commands into Playwright MCP tool calls.
    Output ONLY a JSON array of objects, each with "tool" and "params" properties.
    Available tools:
    - browser_navigate: { url: string }
    - browser_click: { element: string } (CSS selector or accessibility ref)
    - browser_type: { element: string, text: string }
    - browser_snapshot: {} (returns accessibility tree)
    Example output: [{ "tool": "browser_navigate", "params": { "url": "https://example.com" } }]
    Command: ${nlCommand}
  `;

  const { text } = await generateText({
    model: openai('gpt-4o'), // Or 'gpt-3.5-turbo' for cost savings
    system: 'You are a precise JSON generator.',
    prompt,
  });

  if (!text) throw new Error('No response from AI SDK');
  return JSON.parse(text);
}

export const POST = async (request: Request) => {
  try {
    const command = `navigate to https://preview.wallet.kadena.io/ and create a profile`;
    const tools = await translateToMcpTools(command);

    const results = [];
    for (const toolCall of tools) {
      const response = await fetch('http://localhost:3001/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Math.random(),
          method: toolCall.tool,
          params: toolCall.params,
        }),
      });
      const result = await response.json();
      results.push(result);
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const runtime = 'edge';
