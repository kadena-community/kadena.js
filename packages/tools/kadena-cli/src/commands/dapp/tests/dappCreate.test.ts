import { spawnSync } from 'child_process';
import type { MockInstance } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { services } from '../../../services/index.js';
import { mockPrompts, runCommand } from '../../../utils/test.util.js';

// Mock the entire child_process module
// Using spyOn for spawnSync will not work because it is a read-only function from child_process
vi.mock('child_process', () => {
  return {
    spawnSync: vi.fn(),
  };
});

describe('dapp add command', () => {
  beforeEach(() => {
    (spawnSync as unknown as MockInstance).mockReset();
  });

  it('should delete account alias file', async () => {
    const mockOutput = 'success';
    (spawnSync as unknown as MockInstance).mockImplementation(() => ({
      pid: 12345,
      output: [Buffer.from(''), Buffer.from(mockOutput), Buffer.from('')],
      stdout: Buffer.from(mockOutput),
      stderr: Buffer.from(''),
      status: 0,
      signal: null,
      error: undefined,
    }));
    mockPrompts({
      select: {
        'What template do you want to use?': 'vuejs',
      },
    });

    await runCommand('dapp add my-first-app');

    expect(spawnSync).toHaveBeenCalledWith(
      'npx',
      [
        '@kadena/create-kadena-app',
        'generate-project',
        '-n',
        'my-first-app',
        '-t',
        'vuejs',
      ],
      { stdio: 'inherit' },
    );
  });

  it('should throw an error when user runs the command without project directory', async () => {
    mockPrompts({
      select: {
        'What template do you want to use?': 'vuejs',
      },
    });
    const { stderr } = await runCommand('dapp add');
    expect(stderr).toContain(
      'Project name is required, e.g. `kadena dapp add my-dapp`',
    );
  });

  it('should thrown an error when user passes the existing project directory', async () => {
    await services.filesystem.ensureDirectoryExists('test-my-first-app');
    const { stderr } = await runCommand(
      'dapp add test-my-first-app --dapp-template=nextjs',
    );
    expect(stderr).toContain(
      'Project directory test-my-first-app already exists',
    );

    // clean up the created directory
    await services.filesystem.deleteDirectory('test-my-first-app');
  });
});
