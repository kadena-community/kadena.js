import { supabaseClient } from '@/utils/db/createClient';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import path from 'path';
import { promisify } from 'util';
import {
  cleanUpContainerAndFiles,
  convertScreenshotsToBase64,
  generateDockerfile,
  generatePlaywrightConfig,
  readLogs,
  readTestResults,
} from './utils';

// Promisify exec to use async/await
const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  const { appId, testId } = await request.json();

  // Directory to store artifacts on the host
  const artifactsDir = path.join(
    process.cwd(),
    'artifacts',
    `${appId}-${testId}`,
  );

  const {
    data: { script },
  } = await supabaseClient
    .from('app_test_versions')
    .select('*')
    .eq('id', testId)
    .eq('app_id', appId)
    .single();

  const testScript = script;

  const imageName = `my-playwright-image-${appId}-${testId}`;
  const containerName = `my-playwright-container-${appId}-${testId}`;
  const dockerfilePath = path.join(process.cwd(), 'src', 'dockerplaywright');
  const tempTestDir = path.join(dockerfilePath, `temp-${appId}-${testId}`);
  const playwrightConfig = generatePlaywrightConfig();

  await cleanUpContainerAndFiles({
    containerName,
    artifactsDir,
    tempTestDir,
  });

  try {
    console.log('Received POST data:', { testScript });

    if (!appId || !testId || !testScript || !playwrightConfig) {
      return NextResponse.json(
        {
          error: 'appId, testId, testScript, and playwrightConfig are required',
        },
        { status: 400 },
      );
    }

    // Validate appId and testId to prevent command injection
    const idRegex = /^[a-zA-Z0-9-]+$/;
    if (!idRegex.test(appId) || !idRegex.test(testId)) {
      return NextResponse.json(
        {
          error:
            'appId and testId must contain only alphanumeric characters and hyphens',
        },
        { status: 400 },
      );
    }

    // Create a temporary directory for the Docker context

    await fs.mkdir(tempTestDir, { recursive: true });

    // Write dynamic test script, Playwright config, and Dockerfile
    const testFilePath = path.join(tempTestDir, 'tests', 'dynamic.test.js');
    const configFilePath = path.join(tempTestDir, 'playwright.config.js');
    const dockerfilePathTemp = path.join(tempTestDir, 'Dockerfile');
    await fs.mkdir(path.join(tempTestDir, 'tests'), { recursive: true });
    await fs.writeFile(testFilePath, testScript);
    await fs.writeFile(configFilePath, playwrightConfig);
    await fs.writeFile(dockerfilePathTemp, generateDockerfile());

    // Copy package.json to temp directory
    await fs.copyFile(
      path.join(dockerfilePath, 'package.json'),
      path.join(tempTestDir, 'package.json'),
    );
    await fs.copyFile(
      path.join(dockerfilePath, 'package-lock.json'),
      path.join(tempTestDir, 'package-lock.json'),
    );

    await fs.rm(artifactsDir, { recursive: true, force: true });
    await fs.mkdir(artifactsDir, { recursive: true });

    // Build the Docker image
    console.log('Building Docker image...');
    const buildCommand = `docker build -t ${imageName} ${tempTestDir}`;
    const { stderr: buildStderr } = await execAsync(buildCommand);
    if (buildStderr) {
      console.warn('Docker build stderr:', buildStderr);
    }

    // Verify container creation
    console.log('Running Docker container...');
    const runCommand = `docker run --name ${containerName} -d ${imageName}`;

    try {
      const { stderr } = await execAsync(runCommand);

      if (stderr) {
        console.warn('Docker run stderr:', stderr);
      }
    } catch (err) {
      throw new Error(`Failed to run container: ${err.message}`);
    }

    // Wait for the container to finish
    console.log('Waiting for container to finish...');
    const { stdout: waitStdout } = await execAsync(
      `docker wait ${containerName}`,
    );
    console.log('Container wait result:', waitStdout);

    // Debug: Check container logs
    const { stdout: containerLogs } = await execAsync(
      `docker logs ${containerName}`,
    );
    console.log('Container logs:', containerLogs);

    // Copy artifacts from the container to the host
    const containerArtifactsDir = '/app/test-results';
    const screenshotsDir = '/app/screenshots';
    const hostArtifactsDir = artifactsDir.replace(/\\/g, '/');

    try {
      await execAsync(
        `docker cp ${containerName}:${containerArtifactsDir} ${hostArtifactsDir}/test-results`,
      );
      console.log('Copied test-results');
    } catch (err) {
      console.warn(`Failed to copy ${containerArtifactsDir}:`, err);
    }

    try {
      await execAsync(
        `docker cp ${containerName}:${screenshotsDir} ${hostArtifactsDir}/screenshots`,
      );
      console.log('Copied screenshots');
    } catch (err) {
      console.warn(`Failed to copy ${screenshotsDir}:`, err);
    }

    // get the results
    const testResults = await readTestResults(
      path.join(artifactsDir, 'test-results', 'report.json'),
    );
    const screenshots: { [key: string]: string } =
      await convertScreenshotsToBase64(path.join(artifactsDir, 'screenshots'));
    const logs = await readLogs(
      path.join(artifactsDir, 'test-results', 'logs.txt'),
    );

    const insertData = {
      version_id: testId,
      logs,
      container_logs: containerLogs,
      start_time: testResults?.startTime,
      duration: Number(testResults?.duration) || 0,
      expected: testResults?.expected || 0,
      flaky: testResults?.flaky || 0,
      skipped: testResults?.skipped || 0,
      unexpected: testResults?.unexpected || 0,
      config: testResults?.config || {},
      errors: testResults?.errors || [],
      suits: testResults?.suites || {},
      screenshots,
    };

    const { data, error } = await supabaseClient
      .from('runs')
      .insert(insertData)
      .select()
      .single();

    console.log('Inserted run data:', { data, error });

    return NextResponse.json(insertData);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute CLI',
        details: error.message || 'Unknown error',
      },
      { status: 500 },
    );
  } finally {
    await cleanUpContainerAndFiles({
      containerName,
      artifactsDir,
      tempTestDir,
    });
  }
}

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
