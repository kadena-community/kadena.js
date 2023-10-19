import { describe, it, expect } from "vitest";
import { decode, encode } from "../encode";

describe("encode", () => {
  it("encodes a string", () => {
    const string = '{"foo":"bar"}';

    expect(encode(string)).toBe("eyJmb28iOiJiYXIifQ");
  });

  it("decodes a string", () => {
    const string = "eyJmb28iOiJiYXIifQ";

    expect(decode(string)).toBe('{"foo":"bar"}');
  });
});
