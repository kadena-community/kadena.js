import type { Page } from '@playwright/test';
import dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

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
      fs.readFileSync(`./_generated/${name}.json`, 'utf8'),
    );

    return walletImportData;
  }
  public async removeSetupProps(name: string): Promise<void> {
    try {
      await fs.unlinkSync(`./_generated/${name}.json`);
    } catch (e) {}
  }

  public async setSetupProps(
    name: string,
    accountData: ILoginDataProps,
  ): Promise<void> {
    fs.mkdirSync(`./_generated/`, { recursive: true });
    fs.writeFileSync(
      `./_generated/${name}.json`,
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

        await (window as any).DevWallet.importBackup(
          walletImportData.data,
          profileUUIDs,
        );
        return walletImportData;
      },
      { walletImportData },
    );
  }

  public async restoreBackup(
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
