import * as yaml from 'js-yaml';

/*
  @defaults: https://github.com/kadena-io/txlib/tree/master

  Example simple ktpl template:

  code: |-
    (coin.transfer "{{{from-acct}}}" "{{{to-acct}}}" {{amount}})
  data:
  meta:
    chainId: "{{chain}}"
    sender: "{{{to-acct}}}"
    gasLimit: 4600
    gasPrice: 0.000001
    ttl: 600
  networkId: "{{network}}"
  signers:
    - public: "{{from-key}}"
      caps:
        - name: "coin.TRANSFER"
          args: ["{{{from-acct}}}", "{{{to-acct}}}", {{amount}}]
    - public: "{{to-key}}"
      caps:
        - name: "coin.GAS"
          args: []
  type: exec

  Example complex ktpl template:

  # A Kadena gas station is nothing more than a KDA account controlled by a
  # special guard. This transaction template constructs gas station
  # safely...i.e. it calls rotate after creating the account to ensure that you
  # will be able to rotate it's guard in the future if any of the gas station's
  # limits need to be changed. The mk-guard lambda function makes the important
  # parts of the guard DRY to minimize the chance of mistakes.
  code: |-
    (let
      ((mk-guard (lambda (max-gas-price:decimal)
                  (util.guards.guard-or
                    (keyset-ref-guard "ns-admin-keyset")
                    (util.guards1.guard-all
                      [ (create-user-guard (coin.gas-only))
                        (util.guards1.max-gas-price max-gas-price)
                        (util.guards1.max-gas-limit 500)
                      ]))
                )
      )
      )

      (coin.transfer-create
        "{{{funding-acct}}}"
        "{{{gas-station-name}}}"
        (mk-guard 0.0000000001)
        {{amount}})
      (coin.rotate
        "{{{gas-station-name}}}"
        (mk-guard 0.00000001))
    )
  data:
  meta:
    chainId: "{{chain}}"
    sender: "{{{funding-acct}}}"
    gasLimit: 2000
    gasPrice: 0.00000001
    ttl: 7200
  networkId: "{{network}}"
  signers:
    - public: "{{funding-key}}"
      caps:
        - name: "coin.TRANSFER"
          args: ["{{{funding-acct}}}", "{{{gas-station-name}}}", {{amount}}]
        - name: "coin.GAS"
          args: []
    - public: "{{owner-key}}"
      caps:
        - name: "coin.ROTATE"
          args: ["{{{gas-station-name}}}"]
  type: exec

*/

/**
 * Represents a value in the template that can be a primitive, object, or array.
 */
type TemplateValue = string | number | boolean | ITemplate | ITemplateArray;

/**
 * Represents an array of template values.
 */
type ITemplateArray = TemplateValue[];

/**
 * Represents a template with keys and corresponding values.
 */
interface ITemplate {
  [key: string]: TemplateValue;
}

/**
 * Represents a set of values for filling the template.
 */
interface IValues {
  [key: string]: string | number | boolean;
}

/**
 * Represents a function type that prompts user for values of placeholders.
 */
type PromptFunction = (placeholders: string[]) => Promise<IValues>;

/**
 * Substitutes placeholders in a string template with actual values.
 * @param {string} template - The template with placeholders.
 * @param {IValues} values - The actual values for the placeholders.
 * @returns {string} The template string with placeholders substituted.
 *
 */
function substitute(template: string, values: IValues): string {
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
export function fillYAMLTemplate(
  yamlTemplate: string,
  values: IValues,
): string {
  const parsedTemplate = yaml.load(yamlTemplate) as ITemplate; // Type assertion here
  const processedTemplate = processItem(parsedTemplate, values);
  return yaml.dump(processedTemplate);
}

/**
 * Processes an item, which can be an object, array, or primitive, and replaces placeholders with provided values.
 * @param {any} item - The item to process.
 * @param {Values} values - The values to use for replacement.
 * @returns {any} The processed item.
 */
function processItem(item: TemplateValue, values: IValues): TemplateValue {
  if (typeof item === 'object') {
    if (Array.isArray(item)) {
      return item.map((subItem) =>
        processItem(subItem, values),
      ) as TemplateValue;
    } else {
      const result: ITemplate = {};
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          result[key] = processItem(item[key] as TemplateValue, values);
        }
      }
      return result;
    }
  } else if (typeof item === 'string') {
    return substitute(item, values);
  } else {
    return item;
  }
}

/**
 * Extract placeholders enclosed in {{{ }}} from a given template.
 * @param {string} template - The template containing placeholders.
 * @returns {string[]} An array of extracted placeholders.
 */
export function extractPlaceholders(template: string): string[] {
  const regex = /\{\{(\{?[^}]+)\}\}\}?/g;
  let match;
  const placeholders = new Set<string>();

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
export async function fillYAMLTemplateInteractive(
  yamlTemplate: string,
  prompter: PromptFunction,
): Promise<string> {
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
export function findTemplateHoles(template: string): IValues {
  const placeholders = extractPlaceholders(template);
  const holes: IValues = {};

  for (const placeholder of placeholders) {
    holes[placeholder] = '<MISSING>'; // kda-tool uses null, but I think this is better
  }

  return holes;
}

// TO-DO: Implement these functions (need more research on the ktpl feature)
interface ITransaction {}

// convert parsed template to TX
export function convertToTx(parsedTemplate: ITemplate): ITransaction {
  // TO-DO: Convert the parsed template to the appropriate transaction format, figure out how to do this
  throw new Error('Function not implemented');
}
