import { retrieveContractFromChain } from '../typescript/utils/retrieveContractFromChain.js';
import { writeFileSync } from 'fs';
import { join } from 'path';
export function retrieveContract(__program, __version) {
    return async function action({ module, out, network, chain, api }) {
        const code = await retrieveContractFromChain(module, api, chain, network);
        if (code !== undefined && code.length !== 0) {
            writeFileSync(join(process.cwd(), out), code, 'utf8');
        }
    };
}
