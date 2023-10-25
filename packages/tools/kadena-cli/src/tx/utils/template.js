import * as yaml from 'js-yaml';
/**
 * Substitutes placeholders in a string template with actual values.
 * @param {string} template - The template with placeholders.
 * @param {IValues} values - The actual values for the placeholders.
 * @returns {string} The template string with placeholders substituted.
 *
 */
function substitute(template, values) {
    return template.replace(/\{\{(\{?[^}]+)\}\}\}?/g, (val, placeholder) => {
        return values.hasOwnProperty(placeholder)
            ? String(values[placeholder])
            : val;
    });
}
/**
 * Fills a YAML template string using the provided values.
 * @param {string} yamlTemplate - The YAML template to fill.
 * @param {IValues} values - The values to use.
 * @returns {string[]} An array of filled templates.
 * @throws {Error} If there's an issue with filling the template.
 */
export function fillYAMLTemplate(yamlTemplate, values) {
    const parsedTemplate = yaml.load(yamlTemplate); // Type assertion here
    const processedTemplate = processItem(parsedTemplate, values);
    return yaml.dump(processedTemplate);
}
/**
 * Processes an item, which can be an object, array, or primitive, and replaces placeholders with provided values.
 * @param {any} item - The item to process.
 * @param {Values} values - The values to use for replacement.
 * @returns {any} The processed item.
 */
function processItem(item, values) {
    if (typeof item === 'object') {
        if (Array.isArray(item)) {
            return item.map((subItem) => processItem(subItem, values));
        }
        else {
            const result = {};
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    result[key] = processItem(item[key], values);
                }
            }
            return result;
        }
    }
    else if (typeof item === 'string') {
        return substitute(item, values);
    }
    else {
        return item;
    }
}
/**
 * Extract placeholders enclosed in {{{ }}} from a given template.
 * @param {string} template - The template containing placeholders.
 * @returns {string[]} An array of extracted placeholders.
 */
export function extractPlaceholders(template) {
    const regex = /\{\{(\{?[^}]+)\}\}\}?/g;
    let match;
    const placeholders = new Set();
    while ((match = regex.exec(template)) !== null) {
        placeholders.add(match[1]);
    }
    return [...placeholders];
}
/**
 * Fills a template with values provided interactively.
 * @param {string} yamlTemplate - The YAML template to fill.
 * @param {PromptFunction} prompter - The function to prompt for values.
 * @returns {Promise<string>} The filled template.
 */
export async function fillYAMLTemplateInteractive(yamlTemplate, prompter) {
    const placeholders = extractPlaceholders(yamlTemplate);
    /* Note
     *
     * The prompter that will be passed is collectResponses() from helpers.ts
     * which is a function that takes in a list of questions and returns a list of responses
     *
     * It will also handle the defaults from the project by using processProject() from helpers.ts
     * which takes a project file and gets the network/chain etc. from it
     *
     */
    const values = await prompter(placeholders);
    return fillYAMLTemplate(yamlTemplate, values);
}
/**
 * Identifies and returns placeholders in a template that have not been replaced.
 * Each placeholder is returned with the value '<MISSING>'.
 *
 * @param {string} template - The template containing placeholders.
 * @returns {IValues} An object with the placeholders as keys and '<MISSING>' as their values.
 */
export function findTemplateHoles(template) {
    const placeholders = extractPlaceholders(template);
    const holes = {};
    for (const placeholder of placeholders) {
        holes[placeholder] = '<MISSING>'; // kda-tool uses null, but I think this is better
    }
    return holes;
}
// convert parsed template to TX
export function convertToTx(parsedTemplate) {
    // TO-DO: Convert the parsed template to the appropriate transaction format, figure out how to do this
    throw new Error('Function not implemented');
}
