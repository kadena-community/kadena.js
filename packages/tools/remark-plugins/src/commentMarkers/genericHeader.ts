import { heading, html, paragraph, root, text } from 'mdast-builder';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { type VFile } from 'vfile';

interface PackageJSON {
  name: string;
  description: string;
}

const whiteLogoPath =
  'https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png';
const blackLogoPath =
  'https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png';

export function genericHeader(vFile: VFile) {
  const p = join(vFile.cwd, 'package.json');
  const pkg: PackageJSON = JSON.parse(readFileSync(p, 'utf-8'));
  const { name, description } = pkg;

  const logo = `<picture>
  <source srcset="${whiteLogoPath}" media="(prefers-color-scheme: dark)"/>
  <img src="${blackLogoPath}" width="200" alt="kadena.js logo" />
</picture>`;

  return root([
    heading(1, text(name)),
    paragraph(text(description)),
    html(logo),
  ]);
}
