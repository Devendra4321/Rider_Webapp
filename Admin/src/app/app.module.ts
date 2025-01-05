import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './component/users/users.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
// ...existing code...

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    // ...existing code...
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbPaginationModule,

    // ...existing code...
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
