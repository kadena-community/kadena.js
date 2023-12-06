import fs from 'fs';
import { unified } from 'unified';
import stringify from 'remark-stringify';
import frontmatter from 'remark-frontmatter';

// Replace 'your_file.json' with the path to your JSON file
const jsonFilePath = 'output.json';

// Read the JSON file
const jsonContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

// Convert JSON to MD
const processor = unified()
  .use(stringify)
  .use(frontmatter, ['yaml', 'toml']);

const mdContent = processor.stringify(jsonContent);

// Write the Markdown data to a file
const mdFilePath = 'json2md.md';
fs.writeFileSync(mdFilePath, mdContent, 'utf-8');

console.log('Conversion complete. Markdown file created:', mdFilePath);
