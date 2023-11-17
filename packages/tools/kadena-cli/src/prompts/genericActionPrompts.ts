import { select } from '@inquirer/prompts';
import { ensureFileExists } from '../utils/filesystem.js';

export async function actionFileExistShouldUpdate(
  name: string,
  filePath: string,
): Promise<boolean> {
  if (ensureFileExists(filePath)) {
    const overwrite = await actionHelper(
      `Your config For ${name} already exists. Do you want to update it?`,
    );
    return overwrite === 'yes';
  }
  return true;
}

export async function actionContinue(): Promise<string> {
  return actionHelper('Do you wish to continue ?');
}

export async function actionQuit(): Promise<string> {
  return actionHelper('Do you wish to quit ?');
}

export async function actionAskForPassword(): Promise<string> {
  return actionHelper('Do you wish to enter a password ?');
}

async function actionHelper(message: string): Promise<string> {
  return await select({
    message: message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
}
