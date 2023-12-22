import { select } from '@inquirer/prompts';
import { services } from '../services/index.js';

export async function actionFileExistShouldUpdate(
  name: string,
  filePath: string,
): Promise<boolean> {
  if (await services.filesystem.fileExists(filePath)) {
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

export async function actionAskForUpdatePassword(): Promise<string> {
  return actionHelper('Do you wish to update your password ?');
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
