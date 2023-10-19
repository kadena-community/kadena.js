import { describe, it, expect } from "vitest";
import { mnemonicToSeed } from "@scure/bip39";
import { getAccountBalances, transfer } from "../account";

describe("account info", () => {
  describe.skip("when retrieving account balance", () => {
    it("perform a local call", async () => {
      expect(await getAccountBalances({ account: "andy", fungibles: [] })).toBe(
        {}
      );
    });
    it("should be able to send a transaction", async () => {
      const words =
        "axis clever siren agent vapor surface meadow obey problem oil large wool";
      const seed = await mnemonicToSeed(words);
      expect(
        await transfer({
          sender: "ashwin",
          receiver: "andy",
          amount: 1.0,
          senderKey:
            "f376a261ace5b7f40b3e1bf5603528314f403b65bbb8b30f349c5e90fda89bac",
          // "9b13bbd17b040a3e71c06214326807c5787be37c70c29f2b0fb96e6887a35809",
          chainId: "14",
          seed,
          index: 0,
        })
      ).toEqual({});
    });
  });
});
