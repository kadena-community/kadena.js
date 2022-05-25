/**
 * @typedef {object} Cap - A capability
 * @property {string} name of pact capability to be signed
 * @property {array} args - array of arguments used in pact capability, default to empty array.
 */
type Cap = {
  name: string;
  args: Array<any>;
};

/**
 * TODO: define the set of all possible `args` that are allowed, I believe it's just string/number/object but we need to verify that objects are allowed as args.
 * /

/**
 * Prepares a capability object for use in mkSignerCList.
 * @param {string} name of pact capability to be signed
 * @param {array} args - array of arguments used in pact capability, default to empty array.
 * @returns {Cap} A properly formatted cap object required in SigBuilder
 */
export default function mkCap(name: string, args: Array<any> = []): Cap {
  return {
    name,
    args,
  };
}
