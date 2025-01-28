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
import { RideOngoingComponent } from './pages/ride-ongoing/ride-ongoing.component';
import { TripsComponent } from './pages/trips/trips.component';
import { TripsByIdComponent } from './pages/trips-by-id/trips-by-id.component';
import { MapComponent } from './components/map/map.component';
import { WalletUserComponent } from './pages/wallet-user/wallet-user.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PasswordComponent } from './components/password/password.component';
import { NavbarCaptainComponent } from './components/navbar-captain/navbar-captain.component';
import { CaptainHomeComponent } from './pages/captain-home/captain-home.component';
import { CaptainTripsComponent } from './pages/captain-trips/captain-trips.component';
import { CaptainTripsByIdComponent } from './pages/captain-trips-by-id/captain-trips-by-id.component';
import { RideOngoingInfoComponent } from './components/ride-ongoing-info/ride-ongoing-info.component';
import { CaptainRideOngoingComponent } from './pages/captain-ride-ongoing/captain-ride-ongoing.component';
import { CaptainProfileComponent } from './pages/captain-profile/captain-profile.component';
import { CaptainUploadDocumentComponent } from './pages/captain-upload-document/captain-upload-document.component';
import { WalletCaptainComponent } from './pages/wallet-captain/wallet-captain.component';

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
    RideOngoingComponent,
    TripsComponent,
    TripsByIdComponent,
    MapComponent,
    WalletUserComponent,
    UserProfileComponent,
    ForgotPasswordComponent,
    PasswordComponent,
    NavbarCaptainComponent,
    CaptainHomeComponent,
    CaptainTripsComponent,
    CaptainTripsByIdComponent,
    RideOngoingInfoComponent,
    CaptainRideOngoingComponent,
    CaptainProfileComponent,
    CaptainUploadDocumentComponent,
    WalletCaptainComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
