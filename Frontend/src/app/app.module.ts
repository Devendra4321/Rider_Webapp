import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { CaptainForgotPasswordComponent } from './pages/captain-forgot-password/captain-forgot-password.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environment/environment';
import { RidePopupComponent } from './components/ride-popup/ride-popup.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminDashboardHomeComponent } from './components/admin-dashboard-home/admin-dashboard-home.component';
import { AdminRidesComponent } from './components/admin-rides/admin-rides.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminCaptainsComponent } from './components/admin-captains/admin-captains.component';
import { AdminCaptainsRequestComponent } from './components/admin-captains-request/admin-captains-request.component';
import { PriceCalculatorComponent } from './pages/price-calculator/price-calculator.component';
import { AdminCouponsComponent } from './components/admin-coupons/admin-coupons.component';
import { AdminAddCouponsComponent } from './components/admin-add-coupons/admin-add-coupons.component';
import { AdminUserWalletsComponent } from './components/admin-user-wallets/admin-user-wallets.component';
import { AdminCaptainWalletsComponent } from './components/admin-captain-wallets/admin-captain-wallets.component';
import { AdminAddAdminComponent } from './components/admin-add-admin/admin-add-admin.component';
import { AdminAdminsComponent } from './components/admin-admins/admin-admins.component';
import { AdminVehiclesComponent } from './components/admin-vehicles/admin-vehicles.component';
import { AdminAddVehicleComponent } from './components/admin-add-vehicle/admin-add-vehicle.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';
import { RideChatComponent } from './components/ride-chat/ride-chat.component';

const config: SocketIoConfig = {
  url: environment.SOCKET_URL,
  options: {},
};

// Function to set up ngx-translate with HttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

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
    EmailVerificationComponent,
    CaptainForgotPasswordComponent,
    RidePopupComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminDashboardHomeComponent,
    AdminRidesComponent,
    AdminUsersComponent,
    AdminCaptainsComponent,
    AdminCaptainsRequestComponent,
    PriceCalculatorComponent,
    AdminCouponsComponent,
    AdminAddCouponsComponent,
    AdminUserWalletsComponent,
    AdminCaptainWalletsComponent,
    AdminAddAdminComponent,
    AdminAdminsComponent,
    AdminVehiclesComponent,
    AdminAddVehicleComponent,
    ChatBotComponent,
    RideChatComponent
  ],
  imports: [
    SocketIoModule.forRoot(config),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true,
    }),
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    NgbPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
