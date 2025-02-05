import type { Page } from '@playwright/test';

import * as fs from 'fs';

export interface ILoginDataProps {
  db: {
    name: string;
    version: string;
  };
  profileName: string;
  phrase: string;
  data: any;
}

export class setupDatabase {
  public constructor() {}

  public async getSetupProps(
    name: string,
  ): Promise<ILoginDataProps | undefined> {
    const walletImportData = await JSON.parse(
      fs.readFileSync(`${process.cwd()}/_generated/${name}.json`, 'utf8'),
    );

    return walletImportData;
  }
  public async removeSetupProps(name: string): Promise<void> {
    try {
      await fs.unlinkSync(`${process.cwd()}/_generated/${name}.json`);
    } catch (e) {}
  }

  public async setSetupProps(
    name: string,
    accountData: ILoginDataProps,
  ): Promise<void> {
    fs.mkdirSync(`${process.cwd()}/_generated/`, {
      recursive: true,
    });
    fs.writeFileSync(
      `${process.cwd()}/_generated/${name}.json`,
      JSON.stringify(accountData, null, 2),
      { encoding: 'utf8' },
    );
  }

  public async importBackup(actor: Page, typeName: string) {
    const walletImportData = await this.getSetupProps(typeName);

    if (!walletImportData) return;
    return actor.evaluate(
      async ({ walletImportData }) => {
        const profileUUIDs = walletImportData.data.data.profile.map(
          (profile) => profile.key,
        );
        console.log(2222, (window as any).DevWallet);
        await (window as any).DevWallet.importBackup(
          JSON.stringify(walletImportData.data),
          profileUUIDs,
        );

        console.log(1111);
        return walletImportData;
      },
      { walletImportData },
    );
  }

  public async downloadBackup(
    actor: Page,
    inputData: { profileName: string; phrase: string; typeName: string },
  ) {
    const data = await actor.evaluate(async ({ profileName, phrase }) => {
      const dbs = await window.indexedDB.databases();
      const db = dbs[0];
      const data = await (window as any).DevWallet.serializeTables();

      return {
        db,
        phrase,
        profileName,
        data: JSON.parse(data),
      } as unknown as ILoginDataProps;
    }, inputData);

    await this.setSetupProps(inputData.typeName, data);

    return data;
  }
}
