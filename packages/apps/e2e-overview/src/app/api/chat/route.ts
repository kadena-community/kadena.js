import { execa } from 'execa';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json(); // e.g., { prompt: "Write a React component for a button" }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 },
      );
    }

    // Run the Claude CLI with -p flag
    const { stdout, stderr, exitCode } = await execa(
      'cd ~/Documents/projects/claude && claude',
      [
        '-p',
        prompt,
        '--permission-mode',
        'plan',
        '--output-format',
        'json',
        '--allowedTools',
        'mcp__playwright__browser_snapshot, mcp__playwright__browser_navigate',
      ],
      {
        env: {
          ...process.env,
          ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY, // Fallback if not in ~/.anthropic
        },
        timeout: 30000, // 30s timeout to prevent hanging in serverless
      },
    );

    console.log('CLI stdout:', stdout);
    console.log('CLI stderr:', stderr);

    if (exitCode !== 0) {
      return NextResponse.json(
        { error: 'CLI execution failed', details: stderr },
        { status: 500 },
      );
    }

    return NextResponse.json({ response: stdout });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute CLI',
        details: error.message || 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// For Vercel/serverless compatibility
export const dynamic = 'force-dynamic'; // Prevent caching
export const maxDuration = 30; // Vercel timeout (adjust as needed)
