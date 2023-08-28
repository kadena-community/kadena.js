import fs from 'fs';
import path from 'path';

/**
 * script needed to rename all MDX files to MD
 */

const ROOT = '/../pages';

const changeExtension = (root: string): void => {
  const list = fs.readdirSync(root);

  list.forEach((item: string) => {
    const innerDirName = `${root}/${item}`;

    if (path.extname(item) === '.mdx') {
      fs.renameSync(
        innerDirName,
        innerDirName.substring(0, innerDirName.length - 1),
      );

      //fs.renameSync(item, item.spl)
      return;
    }

    const file = fs.lstatSync(innerDirName);
    if (file.isDirectory()) {
      return changeExtension(innerDirName);
    }
  });
};

changeExtension(__dirname + ROOT);
