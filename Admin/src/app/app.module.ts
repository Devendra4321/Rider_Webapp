import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';

// ...existing code...

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // ...existing code...
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

    // ...existing code...
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
