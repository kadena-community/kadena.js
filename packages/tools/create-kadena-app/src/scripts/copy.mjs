import fs from 'fs';
import copy from 'recursive-copy';

const errors = [];
const success = [];

const copyFolder = async (src, dest) => {
  try {
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, {
        recursive: true,
      });
    }

    const results = await copy(src, dest, {
      dot: true,
    });
    console.log('Copy completed!');
  } catch (error) {
    console.error(`Copy failed: ${error}`);
  }

  return { errors, success };
};

const templatesSourceDirectory = 'templates';
const templatesDistDirectory = 'lib/templates';

await copyFolder(templatesSourceDirectory, templatesDistDirectory);

const pactSourceDirectory = './pact';
const pactTargetDirectory = 'lib/pact';
await copyFolder(pactSourceDirectory, pactTargetDirectory);
