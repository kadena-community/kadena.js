import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
