import axios from 'axios';
import { config } from 'dotenv';
import fs from 'fs';
import { schedule } from 'node-cron';
import path from 'path';

config();

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type CronConfig = {
  path: string;
  schedule: string;
};

type VercelConfig = {
  crons: CronConfig[];
};

const loadConfig = (): VercelConfig => {
  try {
    const data = fs.readFileSync('vercel.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading or parsing vercel.json:', error);
    process.exit(1);
  }
};

const ensureCronDirectory = () => {
  const dirPath = path.join(__dirname, '..', '.cron');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const startCronJobs = (config: VercelConfig) => {
  ensureCronDirectory();

  config.crons.forEach((cron) => {
    schedule(cron.schedule, async () => {
      try {
        console.log(`Executing cron job for ${cron.path}`);
        const response = await axios.get(`${API_URL}${cron.path}`);
        const filename = `.cron/output${cron.path.replace(/\//g, '_')}.txt`;
        fs.appendFileSync(
          filename,
          `${new Date().toISOString()} - ${JSON.stringify(response.data)}\n`,
        );
        console.log(`Executed cron job for ${cron.path}:`, response.data);
      } catch (error) {
        console.error(`Error making GET request to ${cron.path}:`, error);
      }
    });
    console.log(`Scheduled cron job for ${cron.path} at '${cron.schedule}'`);
  });
};

const main = () => {
  const config = loadConfig();
  startCronJobs(config);
};

main();
