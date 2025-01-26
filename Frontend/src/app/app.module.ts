import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { LoginMainComponent } from './components/login-main/login-main.component';
import { LoginCaptainComponent } from './components/login-captain/login-captain.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SignupMainComponent } from './components/signup-main/signup-main.component';
import { SignupUserComponent } from './components/signup-user/signup-user.component';
import { SignupCaptainComponent } from './components/signup-captain/signup-captain.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { RideReviewComponent } from './pages/ride-review/ride-review.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LoginUserComponent,
    LoginMainComponent,
    LoginCaptainComponent,
    SignupComponent,
    SignupMainComponent,
    SignupUserComponent,
    SignupCaptainComponent,
    NavbarComponent,
    UserHomeComponent,
    RideReviewComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
