/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs').promises;
const matter = require('gray-matter');
const path = require('path');

const updateFrontmatter = async () => {
  const docsPath = path.resolve(__dirname, '../../src/pages/docs');

  try {

    const dir = await fs.readdir(docsPath);
    const allFilePaths = [];
    for await (const dirent of dir) {
      const files = await fs.readdir(path.join(docsPath, dirent));
      const mdFilePaths = files
        .filter((file) => file.endsWith('.mdx')).map((file) => path.join(docsPath, dirent, file))
      allFilePaths.push(...mdFilePaths);
    }
    console.log(allFilePaths);
    allFilePaths.forEach(async (path) => {
      const file = matter.read(path)
      const { data: currentFrontmatter } = file;
      console.log({
        currentFrontmatter,
      });

      const updatedFrontmatter = {
        ...currentFrontmatter,
        updatedOn: new Date().toISOString(),
      }
      file.data = updatedFrontmatter
      const updatedFileContent = matter.stringify(file)
      fs.writeFile(path, updatedFileContent);
    })

  } catch (error) {
    console.log(error);
  }

}

updateFrontmatter();
