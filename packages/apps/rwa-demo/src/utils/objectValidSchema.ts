export const objectValidSchema =
  (schema: Record<string, string>) => (input: any) => {
    const missingProperties = Object.keys(schema)
      .filter((key) => input[key] === undefined)
      .map((key) => new Error(`Document is missing ${key} ${schema[key]}`));

    return missingProperties.length === 0;
  };
