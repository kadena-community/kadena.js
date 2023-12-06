import fs from 'fs';
import yaml from 'js-yaml';
import { unified } from 'unified';
import stringify from 'remark-stringify';
import frontmatter from 'remark-frontmatter';

// Load the JSON file
const data = JSON.parse(fs.readFileSync('output.json', 'utf-8'));

function iterateNode(node) {
  if(Array.isArray(node.children)) {
    const children =  node.children.map(iterateNode);
    node.children = children;
    return node;
  } else if (node.type === 'text') {
    const value = `oops... ${node.value}`;
    node.value = value;
    return node;
  } else if(node.type === 'yaml') {
    const value = yaml.load(node.value);
    const newObj = {}
    Object.entries(value).map(([key, value]) => {
      newObj[key] = `oops... ${value}`;
    });
    node.value = yaml.dump(newObj);
    return node;
  }
  return node;
}

const translatedData = [data].map(iterateNode);

console.log(JSON.stringify(translatedData, null, 2));

fs.writeFileSync('translatedJson.json', JSON.stringify(translatedData[0], null, 2), 'utf-8');

const parsedContent = translatedData[0];

// Convert JSON to MD
const processor = unified()
  .use(stringify)
  .use(frontmatter, ['yaml', 'toml']);

const mdContent = processor.stringify(parsedContent);

// Write the Markdown data to a file
const mdFilePath = 'afterTranslateMarkdown.md';
fs.writeFileSync(mdFilePath, mdContent, 'utf-8');

console.log('Conversion complete. Markdown file created:', mdFilePath);
