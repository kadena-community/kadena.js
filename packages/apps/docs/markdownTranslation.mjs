import fs from 'fs';
import yaml from 'js-yaml';
import parse from 'remark-parse';
import { unified } from 'unified';
import stringify from 'remark-stringify';
import frontmatter from 'remark-frontmatter';
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

const mdFilePath = 'translate_input.md';

const mdContent = fs.readFileSync(mdFilePath, 'utf-8');

const processor = unified()
  .use(parse)
  .use(frontmatter, ['yaml', 'toml'])
  .use(stringify);

const parsedContent = processor.parse(mdContent);

// Write the parsed JSON data to a file
// const parsedFilePath = 'parsed.json';
// fs.writeFileSync(parsedFilePath, JSON.stringify(parsedContent, null, 2), 'utf-8');

const data = processor.runSync(parsedContent);

const config = {
  region: "eu-central-1",
};

const client = new TranslateClient(config);

async function translateText(text, sourceLanguageCode = 'en', targetLanguageCode = 'nl') {
  console.log({
    text,
  })
  const params = {
    SourceLanguageCode: sourceLanguageCode,
    TargetLanguageCode: targetLanguageCode,
    Text: text,
  };

  const command = new TranslateTextCommand(params);

  try {
    const response = await client.send(command);
    console.log(response);
    return response.TranslatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
}

async function iterateNode(node) {
  if(Array.isArray(node.children)) {
    const children =  node.children.map(iterateNode);
    node.children = await Promise.all(children);
    return node;
  } else if (node.type === 'text') {
    const value = await translateText(node.value.toString());
    node.value = value;
    return node;
  } else if(node.type === 'yaml') {
    const value = yaml.load(node.value);
    const newObj = {}
    await Promise.all(Object.entries(value).map(async ([key, value]) => {
      newObj[key] = await translateText(value.toString());
    }));
    node.value = yaml.dump(newObj);
    return node;
  }
  return node;
}

const translatedData = await Promise.all([data].map(iterateNode));

// Write the translated JSON data to a file
// console.log(JSON.stringify(translatedData, null, 2));
// fs.writeFileSync('translatedJson.json', JSON.stringify(translatedData[0], null, 2), 'utf-8');

const parsedJSONContent = translatedData[0];

// Convert JSON to MD
const JSON2MDProcessor = unified()
  .use(stringify)
  .use(frontmatter, ['yaml', 'toml']);

const outputMdContent = JSON2MDProcessor.stringify(parsedJSONContent);

// Write the Markdown data to a file
const outputMdFilePath = 'translation_output.md';
fs.writeFileSync(outputMdFilePath, outputMdContent, 'utf-8');

console.log('Translation completed and Markdown file created:', outputMdFilePath);
