import { beforeAll } from 'vitest'
import { createAccounts } from './create-account'


beforeAll(async () => {
  createAccounts()
})
