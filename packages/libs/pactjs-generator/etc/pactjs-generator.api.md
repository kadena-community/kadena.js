## API Report File for "@kadena/pactjs-generator"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// Warning: (ae-forgotten-export) The symbol "IModule" needs to be exported by the entry point index.d.ts
// Warning: (ae-forgotten-export) The symbol "IPointer" needs to be exported by the entry point index.d.ts
//
// @alpha (undocumented)
export function contractParser(contract: string, namespace?: string): [IModule[], IPointer];

// @alpha
export function execCodeParser(code: string): undefined | IParsedCode[];

// @alpha (undocumented)
export function generateDts(module: IModule): string;

// @alpha (undocumented)
export function generateTemplates(templates: {
    name: string;
    template: ITemplate;
}[], version: string): string;

// @alpha (undocumented)
export interface IParsedCode {
    // (undocumented)
    args: Array<{
        string: string;
    } | {
        int: number;
    } | {
        decimal: number;
    } | {
        object: Array<{
            property: string;
            value: IParsedCode['args'][number];
        }>;
    } | {
        list: IParsedCode['args'];
    } | {
        code: IParsedCode;
    }>;
    // (undocumented)
    function: {
        module?: string;
        namespace?: string;
        name: string;
    };
}

// @alpha (undocumented)
export interface ITemplate {
    // (undocumented)
    holes: TemplateHoles;
    // (undocumented)
    parts: TemplateParts;
}

// @alpha (undocumented)
export function pactParser({ contractNames, files, getContract, namespace, }: {
    contractNames?: string[];
    files?: string[];
    getContract: (fullName: string) => Promise<string>;
    namespace?: string;
}): Promise<{
    [k: string]: IModule;
}>;

// @alpha (undocumented)
export function parseTemplate(template: string): ITemplate;

// @alpha (undocumented)
export type TemplateHoles = string[];

// @alpha (undocumented)
export type TemplateParts = string[];

// (No @packageDocumentation comment for this package)

```