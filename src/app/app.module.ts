import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { YadagModule } from 'yadag'

import { AppComponent } from './app.component';
import { SummaryComponent } from './summary/summary.component';
import { DetailComponent } from './detail/detail.component';
import { AddComponent } from './add/add.component';

@NgModule({
  declarations: [
    AppComponent,
    SummaryComponent,
    DetailComponent,
    AddComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    YadagModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
