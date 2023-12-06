import fs from 'fs';
import yaml from 'js-yaml';

// Load the JSON file
const data = JSON.parse(fs.readFileSync('output.json', 'utf-8'));

// Recursive function to extract 'value' from all children
function extractValues(node) {
  if (Array.isArray(node)) {
    return node.flatMap(extractValues);
  } else if (typeof node === 'object' && node !== null) {
    if (node.type === 'text') {
      return node.value;
    } else if (node.type === 'yaml') {
      return yaml.load(node.value);
    } else {
      return extractValues(Object.values(node));
    }
  }
  return [];
}

// Extract all 'value' properties
const values = extractValues(data);

console.log(values);
