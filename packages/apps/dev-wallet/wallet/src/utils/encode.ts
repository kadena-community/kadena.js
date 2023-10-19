function unescape(str: string): string {
  return (str + "===".slice((str.length + 3) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
}

function escape(str: string): string {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function encode(str: string, encoding?: BufferEncoding) {
  return escape(Buffer.from(str, encoding || "utf8").toString("base64"));
}

export function decode(str: string, encoding?: BufferEncoding) {
  return Buffer.from(unescape(str), "base64").toString(encoding || "utf8");
}
