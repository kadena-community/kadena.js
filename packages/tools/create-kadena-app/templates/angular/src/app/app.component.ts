import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  account: string = '';
  messageToWrite: string = '';
  messageFromChain: string = '';
  writeInProgress: boolean = false;

  constructor(private appService: AppService) {}

  async writeMessage(): Promise<void> {
    this.writeInProgress = true;
    await this.appService.writeMessage(this.account, this.messageToWrite);
    this.writeInProgress = false;
  }

  async readMessage(): Promise<void> {
    this.messageFromChain = await this.appService.readMessage(this.account);
  }
}
