import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';
// Promisify exec to use async/await
const execAsync = promisify(exec);

// create DockerFile
export const generateDockerfile = () => `
FROM mcr.microsoft.com/playwright:v1.47.0
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npx playwright install --with-deps
COPY tests/ ./tests/
COPY playwright.config.js ./
RUN mkdir -p /app/test-results /app/screenshots
EXPOSE 3000
CMD ["sh", "-c", "npx playwright test tests/dynamic.test.js > /app/test-results/logs.txt 2>&1"]
`;

// Read screenshots (convert to base64)
export const convertScreenshotsToBase64 = async (
  tempScreenshotsDir: string,
) => {
  const screenshots: { [key: string]: string } = {};
  try {
    const screenshotFiles = await fs.readdir(tempScreenshotsDir);
    for (const file of screenshotFiles) {
      if (file.endsWith('.png')) {
        const screenshotPath = path.join(tempScreenshotsDir, file);
        const buffer = await fs.readFile(screenshotPath);
        screenshots[file] = buffer.toString('base64');
      }
    }
  } catch (err) {
    console.warn('No screenshots found or error reading:', err);
  }

  return screenshots;
};

// Read logs
export const readLogs = async (logPath: string) => {
  try {
    return await fs.readFile(logPath, 'utf-8');
  } catch (err) {
    console.warn('No logs found or error reading:', err);
  }
};

// Read the test results (JSON report)
export const readTestResults = async (resultsPath: string) => {
  try {
    const jsonContent = await fs.readFile(resultsPath, 'utf-8');
    return JSON.parse(jsonContent);
  } catch (err) {
    console.warn('No JSON report found or error parsing:', err);
  }
};

export const cleanUpContainerAndFiles = async ({
  containerName,
  artifactsDir,
  tempTestDir,
}: {
  containerName: string | null;
  artifactsDir: string;
  tempTestDir: string | null;
}) => {
  // Clean up container
  if (containerName) {
    try {
      await execAsync(`docker stop ${containerName}`);
      console.log(`Container ${containerName} stopped`);
    } catch (err: any) {
      console.warn(`Failed to stop container ${containerName}: ${err.message}`);
    }
    try {
      await execAsync(`docker rm ${containerName}`);
      console.log(`Container ${containerName} removed`);
    } catch (err: any) {
      // Ignore "No such container" error, as it means the container is already gone
      if (!err.message.includes('No such container')) {
        console.warn(
          `Failed to remove container ${containerName}: ${err.message}`,
        );
      }
    }
  }

  try {
    await fs.rm(artifactsDir, { recursive: true, force: true });
  } catch (err) {
    console.warn('Artifacts dir not removed', err);
  }

  // Clean up temporary test directory
  if (tempTestDir) {
    try {
      await fs.rm(tempTestDir, { recursive: true, force: true });

      console.log(`Temporary directory ${tempTestDir} removed`);
    } catch (err) {
      console.warn(`Failed to remove temporary directory ${tempTestDir}:`, err);
    }
  }
};

export const generatePlaywrightConfig = () => `
module.exports = {
  use: {
      headless: true,
      screenshot: 'on',
      viewport: { 
        width: 1280, 
        height: 720 },
      },
      outputDir: './screenshots',
      reporter: [
        ['list'],
        ['json', { outputFile: 'test-results/report.json' }],
      ],
      projects: [
        { 
            name: 'chromium', 
            use: { browserName: 'chromium' } 
        }
    ]
};
`;
