// generate-config.ts
import * as fs from "fs";
import * as path from "path";

interface Arg {
  name: string;
  type: string;
  validation?: Record<string, any>;
}

interface FunctionDef {
  name: string;
  type: "read" | "write";
  description: string;
  args: Arg[];
  caps?: string[];
}

interface ModuleConfig {
  namespace: string;
  module: string;
  functions: FunctionDef[];
}

const parseFunctionLine = (
  line: string
): { name: string; args: Arg[] } | null => {
  const defunMatch = line.match(/\(defun\s+([a-zA-Z0-9\-]+)\s*\(([^)]*)\)/);
  if (!defunMatch) return null;
  const name = defunMatch[1];
  const argsRaw = defunMatch[2] || "";
  const args: Arg[] = argsRaw
    .split(/\s+/)
    .map((arg) => arg.trim())
    .filter(Boolean)
    .map((arg) => {
      const [name, type] = arg.split(":");
      return { name, type: type || "any" };
    });
  return { name, args };
};

const inferFunctionType = (block: string): "read" | "write" => {
  return /write|with-capability|enforce-keyset/.test(block) ? "write" : "read";
};

const extractDescription = (lines: string[], index: number): string => {
  for (let i = index; i < Math.min(lines.length, index + 5); i++) {
    const docMatch = lines[i].match(/@doc\s+\"(.+?)\"/);
    if (docMatch) return docMatch[1];
  }
  return "";
};

const isLineCommented = (line: string): boolean => {
  const trimmed = line.trim();
  return trimmed.startsWith(";") || trimmed.startsWith(";;");
};

const isInMultiLineComment = (
  lines: string[],
  currentIndex: number
): boolean => {
  // Check if we're inside a multi-line comment block
  let insideComment = false;

  for (let i = 0; i <= currentIndex; i++) {
    const line = lines[i].trim();

    // Check for comment block start
    if (line.includes("#|")) {
      insideComment = true;
    }

    // Check for comment block end
    if (line.includes("|#")) {
      insideComment = false;
    }
  }

  return insideComment;
};

const isFunctionCommented = (
  lines: string[],
  functionStartIndex: number
): boolean => {
  // Check if the defun line itself is commented
  if (isLineCommented(lines[functionStartIndex])) {
    return true;
  }

  // Check if we're inside a multi-line comment
  if (isInMultiLineComment(lines, functionStartIndex)) {
    return true;
  }

  // Check if the entire function block is commented out
  let openParens = 0;
  let allLinesCommented = true;

  for (let i = functionStartIndex; i < lines.length; i++) {
    const line = lines[i];
    openParens += (line.match(/\(/g) || []).length;
    openParens -= (line.match(/\)/g) || []).length;

    // If we find a non-empty, non-commented line, the function is not commented
    if (
      line.trim() &&
      !isLineCommented(line) &&
      !isInMultiLineComment(lines, i)
    ) {
      allLinesCommented = false;
    }

    if (openParens <= 0) break;
  }

  return allLinesCommented;
};

const preprocessContract = (contract: string): string => {
  // Remove multi-line comments #| ... |#
  let processed = contract.replace(/#\|[\s\S]*?\|#/g, "");

  // Split into lines for single-line comment processing
  const lines = processed.split("\n");
  const filteredLines = lines.map((line) => {
    // Remove single-line comments but preserve the line structure
    const commentIndex = line.indexOf(";");
    if (commentIndex !== -1) {
      // Check if the semicolon is inside a string
      const beforeComment = line.substring(0, commentIndex);
      const quotes = (beforeComment.match(/"/g) || []).length;

      // If odd number of quotes, the semicolon is inside a string
      if (quotes % 2 === 0) {
        return line.substring(0, commentIndex);
      }
    }
    return line;
  });

  return filteredLines.join("\n");
};

const generateConfig = (contract: string): ModuleConfig => {
  // First, preprocess to handle some comment patterns
  const preprocessed = preprocessContract(contract);
  const lines = preprocessed.split("\n");

  let namespace = "free";
  let module = "unknown";
  const functions: FunctionDef[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip commented lines for namespace and module detection
    if (isLineCommented(line) || isInMultiLineComment(lines, i)) {
      continue;
    }

    if (line.includes("(namespace '")) {
      const nsMatch = line.match(/\(namespace\s+'([a-zA-Z0-9\-]+)/);
      if (nsMatch) namespace = nsMatch[1];
    }

    if (line.includes("(module ")) {
      const modMatch = line.match(/\(module\s+([a-zA-Z0-9\-]+)/);
      if (modMatch) module = modMatch[1];
    }

    if (line.includes("(defun")) {
      // Check if this function is commented out
      if (isFunctionCommented(lines, i)) {
        continue;
      }

      const fnMeta = parseFunctionLine(line);
      if (!fnMeta) continue;

      // Skip init function
      if (fnMeta.name === "init") {
        continue;
      }

      const description = extractDescription(lines, i);

      // try to read the block of code after defun
      let block = "";
      let j = i;
      let openParens = 0;
      do {
        const l = lines[j];
        openParens += (l.match(/\(/g) || []).length;
        openParens -= (l.match(/\)/g) || []).length;
        block += l + "\n";
        j++;
      } while (j < lines.length && openParens > 0);

      // detect capabilities required by this function
      const capMatches = [
        ...block.matchAll(/with-capability\s*\(\s*([\w\.-]+)/g),
      ].map((m) => m[1]);
      const caps = Array.from(new Set(capMatches));

      functions.push({
        name: fnMeta.name,
        args: fnMeta.args,
        type: inferFunctionType(block),
        description,
        caps: caps.length ? caps : undefined,
      });
    }
  }

  return { namespace, module, functions };
};

const main = () => {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: ts-node generate-config.ts <path-to-pact-file>");
    process.exit(1);
  }

  const source = fs.readFileSync(path.resolve(inputPath), "utf-8");
  const config = generateConfig(source);
  console.log(JSON.stringify(config, null, 2));
};

main();
