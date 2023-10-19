const CURRENT_DIAMETER = 3;
const MIN_LENGTH = 4;

// https://en.wikipedia.org/wiki/Table_of_the_largest_known_graphs_of_a_given_diameter_and_maximal_degree
const diametersChains = [20, 20, 20, 38, 70, 132, 196, 336, 600, 1250];

function getChainsInDiameter(diameter: number) {
  if (diameter > diametersChains.length || diameter < 1)
    throw new Error("DIAMETER_OUTSIDE_RANGE");
  return diametersChains[diameter - 1];
}

export function convertToNumber(tld: string): bigint {
  const chars = tld.split("");
  const number: bigint = chars.reduceRight((acc, char, idx) => {
    const code = char.charCodeAt(0) - 96;
    if (code < 1 || code > 26) {
      throw new Error(`INVALID_CHAR: ${char}`);
    }
    // using BigInt to avoid overflow
    return BigInt(code) * BigInt(26) ** BigInt(chars.length - 1 - idx) + acc;
  }, BigInt(0));
  return number - BigInt(1);
}

export function nameToChianId(name: string) {
  if (name == undefined || name.length < MIN_LENGTH) {
    throw new Error("INVALID_STRING_LENGTH");
  }

  const diameter = Math.floor(name.length / 4) + 1;

  if (diameter > CURRENT_DIAMETER) {
    throw new Error("INVALID_STRING_LENGTH");
  }
  const chainsInTheDiameter = getChainsInDiameter(diameter);
  const number = convertToNumber(name);
  const chianId = number % BigInt(chainsInTheDiameter);
  return Number(chianId);
}
