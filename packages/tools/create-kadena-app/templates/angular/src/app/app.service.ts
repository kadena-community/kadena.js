import { Injectable } from '@angular/core';
import readMessage from '../utils/readMessage';
import writeMessage from '../utils/writeMessage';

@Injectable({ providedIn: 'root' })
export class AppService {
  async writeMessage(account: string, message: string) {
    try {
      await writeMessage({ account, messageToWrite: message });
    } catch (e) {
      console.log(e);
    }
  }

  async readMessage(account: string): Promise<string> {
    try {
      return await readMessage({ account });
    } catch (e) {
      throw e;
    }
  }
}
