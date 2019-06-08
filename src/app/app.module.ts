import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { CustomMaterialModule } from "../material.module";
import { BackendService } from './backend.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CustomMaterialModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    BackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
