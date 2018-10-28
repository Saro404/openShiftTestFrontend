import { NgModule } from '@angular/core';
import {MainComponent} from "./main/main.component";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";


@NgModule({
  bootstrap: [MainComponent],
  imports: [BrowserModule, HttpModule],
  declarations: [
      MainComponent
  ],
  exports: [],
  providers: []
})

export class AppModule {}
