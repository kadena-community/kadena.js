import { getFile } from "../utils/getFile"

describe('getFile', () => {
    it('should return undefined when child.root is empty', () => {
        const result = getFile('/non/existing/path', [],{ children: [], root: '/reference/kadena-client/client-utils' })
})