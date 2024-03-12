import { exec } from 'child_process';

// Define the path to your pages directory
const pagesTwoLevelsPath = './src/pages/**/**/*.md';

// Construct the remark command
const pagesTwoLevelsCommand = `npx remark ${pagesTwoLevelsPath} --frail`;

exec(pagesTwoLevelsCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
});

const pagesOneLevelPath = './src/pages/**/*.md';

const pagesOneLevelCommand = `npx remark ${pagesOneLevelPath}  --frail`;

exec(pagesOneLevelCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
});
