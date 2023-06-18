import { pactParser } from '../../parsing/pactParser';
import { generateDts2 } from '../generatorV2';

describe('generateDts2', () => {
  it('return type definition file for a module', async () => {
    const module = `(namespace "user")
      (module test-module governance
        (defcap test-cap (name:string) true)
        (defun test-func:boolean (parameter-one:string parameter-two:boolean )
          (with-capability (test-cap "name"))
        )
      )
    `;

    const modules = await pactParser({
      files: [module],
      getContract: () => Promise.resolve(''),
    });

    const dts = generateDts2('user.test-module', modules);
    expect(dts).toMatchSnapshot();
  });
});
