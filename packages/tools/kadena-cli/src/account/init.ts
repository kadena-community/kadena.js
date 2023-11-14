import { accountDefaults } from '../constants/accounts.js';
import { writeAccount } from './accountHelpers.js';

// await import ('../keyset/init.js');

writeAccount(accountDefaults.sender00);
