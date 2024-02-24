const { exec } = require('child_process');

// Define the path to your pages directory
const pagesPath = './src/pages/**/**/*.md';

// Construct the remark command
const command = `npx remark ${pagesPath} --frail`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  // console.log(`stdout: ${stdout}`);
});

const command1 = 'npx remark ./src/pages/**/*.md --frail';

exec(command1, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  // console.log(`stdout: ${stdout}`);
});
