import { describe, it, expect } from "vitest";
import { generateMnemonic, mnemonicToSeed } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { deriveKeyPair } from "../sign";

describe("sign", () => {
  describe("when creating a derivation key", () => {
    it("should return a derivation key", async () => {
      const words = generateMnemonic(wordlist);

      console.log(words);
    });
    it("should generate the same key from the same mnemonic", async () => {
      const words =
        "axis clever siren agent vapor surface meadow obey problem oil large wool";
      const seed = await mnemonicToSeed(words);
      const firstKeyPair = deriveKeyPair(seed, 0);
      expect(firstKeyPair.publicKey).toEqual(
        "a1206404ac54042f5c22071d92fe7ab904503070cdb2ab8b257d9c99f89d3f63"
      );
    });
  });
});
