import fs from 'fs';
import { unified } from 'unified';
import parse from 'remark-parse';
import frontmatter from 'remark-frontmatter';
import stringify from 'remark-stringify';
import yaml from 'js-yaml';

// Replace 'your_file.md' with the path to your Markdown file
const mdFilePath = 'input.md';

// Read the Markdown file
const mdContent = fs.readFileSync(mdFilePath, 'utf-8');

// Convert MD to JSON
const processor = unified()
  .use(parse)
  .use(frontmatter, ['yaml', 'toml'])
  .use(stringify);

const parsedContent = processor.parse(mdContent);
const parsedFilePath = 'parsed.json';
fs.writeFileSync(parsedFilePath, JSON.stringify(parsedContent, null, 2), 'utf-8');
const jsonContent = processor.runSync(parsedContent);

// const unParsedYaml = jsonContent.children.filter((node) => {
//   return node.type === 'yaml';
// });

// const parsedYaml = yaml.load(unParsedYaml[0].value);

// Write the JSON data to a file
const jsonFilePath = 'output.json';
fs.writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 2), 'utf-8');

console.log('Conversion complete. JSON file created:', jsonFilePath);
