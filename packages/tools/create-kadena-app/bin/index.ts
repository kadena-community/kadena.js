#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

// Required to emulate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function init() {
  const { folder } = await inquirer.prompt<{ folder: string }>([
    {
      type: "input",
      name: "folder",
      message: "Enter your project name:",
      default: "kadena-project",
    },
  ]);
  const targetPath = path.resolve(process.cwd(), folder);
  const templatePath = path.resolve(__dirname, "template");

  await fs.copy(templatePath, targetPath);

  console.log(`\n✅ Project created in ${folder}`);
  console.log("Next steps:");
  console.log(`  cd ${folder}`);
  console.log(`  npm install\n`);
}

init();
