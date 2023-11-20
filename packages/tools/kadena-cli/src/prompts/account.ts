// import { select } from '@inquirer/prompts';
// import { program } from 'commander';

// export async function accountSelectPrompt(
//   isOptional: boolean = false,
// ): Promise<string | 'skip'> {
//   const existingAccounts: ICustomAccountChoice[] = await getExistingAccounts();

//   let choices: ICustomAccountChoice[] = existingAccounts.map((account) => ({
//     value: account.value,
//     name: account.name,
//   }));

//   if (isOptional) {
//     choices.push({
//       value: 'skip',
//       name: 'Account is optional. Continue to next step',
//     });
//   }

//   choices.push({ value: 'createNewAccount', name: 'Create a new account' });

//   const selectedAccount = await select({
//     message: 'Select an account',
//     choices: choices,
//   });

//   if (selectedAccount === 'createNewAccount') {
//     await program.parseAsync(['', '', 'account', 'create']);
//     return accountSelectPrompt(isOptional);
//   } else if (selectedAccount !== 'skip') {
//     return selectedAccount;
//   }

//   return 'skip';
// }
