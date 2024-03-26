import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'pathe';

export const pactFile = `
(namespace 'free )
(module hello-world G
  (defcap G () true)
  (defun say-hello(name:string)
    (format "Hello, {}!" [name])
  )
)
`.trim();

export const replFile = `
(load "prelude/init.repl")
(begin-tx "Load hello-world module")
(env-data {
  'hello-ks: { "keys": [], "pred": "keys-all" }
})
(load "hello-world.pact")
(expect "should say hello world!" (free.hello-world.say-hello "world") "Hello, world!")
(commit-tx)
`.trim();

export async function createHelloWorld(contractFolder: string) {
  // check if contract folder exists
  if (!existsSync(contractFolder)) {
    await mkdir(contractFolder, { recursive: true });
  }
  // overwrite hello-world.pact and hello-world.repl
  await writeFile(join(contractFolder, 'hello-world.pact'), pactFile);
  await writeFile(join(contractFolder, 'hello-world.repl'), replFile);
}
