import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { LoginMainComponent } from './components/login-main/login-main.component';
import { LoginCaptainComponent } from './components/login-captain/login-captain.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SignupMainComponent } from './components/signup-main/signup-main.component';
import { SignupUserComponent } from './components/signup-user/signup-user.component';
import { SignupCaptainComponent } from './components/signup-captain/signup-captain.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { RideReviewComponent } from './pages/ride-review/ride-review.component';
import { RideOngoingComponent } from './pages/ride-ongoing/ride-ongoing.component';
import { TripsComponent } from './pages/trips/trips.component';
import { TripsByIdComponent } from './pages/trips-by-id/trips-by-id.component';
import { WalletUserComponent } from './pages/wallet-user/wallet-user.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { CaptainHomeComponent } from './pages/captain-home/captain-home.component';
import { CaptainTripsComponent } from './pages/captain-trips/captain-trips.component';
import { CaptainTripsByIdComponent } from './pages/captain-trips-by-id/captain-trips-by-id.component';
import { CaptainRideOngoingComponent } from './pages/captain-ride-ongoing/captain-ride-ongoing.component';
import { CaptainProfileComponent } from './pages/captain-profile/captain-profile.component';
import { CaptainUploadDocumentComponent } from './pages/captain-upload-document/captain-upload-document.component';
import { WalletCaptainComponent } from './pages/wallet-captain/wallet-captain.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { CaptainForgotPasswordComponent } from './pages/captain-forgot-password/captain-forgot-password.component';
import { AuthGuardUser } from './services/auth-guard-user/auth-user.guard';
import { AuthGuardCaptain } from './services/auth-guard-captain/auth-captain.guard';
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
import { AuthGuardAdmin } from './services/auth-guard-admin/auth-admin.guard';
import { AdminAddAdminComponent } from './components/admin-add-admin/admin-add-admin.component';
import { AdminAdminsComponent } from './components/admin-admins/admin-admins.component';
import { AdminVehiclesComponent } from './components/admin-vehicles/admin-vehicles.component';
import { AdminAddVehicleComponent } from './components/admin-add-vehicle/admin-add-vehicle.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    children: [
      {
        path: '',
        component: LoginMainComponent,
      },
      {
        path: 'user',
        component: LoginUserComponent,
      },
      {
        path: 'captain',
        component: LoginCaptainComponent,
      },
    ],
  },
  {
    path: 'signup',
    component: SignupComponent,
    children: [
      {
        path: '',
        component: SignupMainComponent,
      },
      {
        path: 'user',
        component: SignupUserComponent,
      },
      {
        path: 'captain',
        component: SignupCaptainComponent,
      },
    ],
  },

  {
    path: 'verify-email',
    component: EmailVerificationComponent,
  },
  {
    path: 'price-calculator',
    component: PriceCalculatorComponent, 
  },

  //User routes

  {
    path: 'user-home',
    component: UserHomeComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: 'ride-review',
    component: RideReviewComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: 'ride-ongoing/:rideId',
    component: RideOngoingComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: 'trips',
    component: TripsComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: 'trips/:rideId',
    component: TripsByIdComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: 'wallet-user',
    component: WalletUserComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: 'forgot-password/user',
    component: ForgotPasswordComponent,
  },

  //Captain routes

  {
    path: 'captain-home',
    component: CaptainHomeComponent,
    canActivate: [AuthGuardCaptain],
  },
  {
    path: 'captain-trips',
    component: CaptainTripsComponent,
    canActivate: [AuthGuardCaptain],
  },
  {
    path: 'captain-trips/:rideId',
    component: CaptainTripsByIdComponent,
    canActivate: [AuthGuardCaptain],
  },
  {
    path: 'captain-ride-ongoing/:rideId',
    component: CaptainRideOngoingComponent,
    canActivate: [AuthGuardCaptain],
  },
  {
    path: 'captain-profile',
    component: CaptainProfileComponent,
    canActivate: [AuthGuardCaptain],
  },
  {
    path: 'captain-upload-document',
    component: CaptainUploadDocumentComponent,
    canActivate: [AuthGuardCaptain],
  },
  {
    path: 'wallet-captain',
    component: WalletCaptainComponent,
    canActivate: [AuthGuardCaptain],
  },
  {
    path: 'forgot-password/captain',
    component: CaptainForgotPasswordComponent,
  },

  //admin routes
  {
    path: 'admin-login',
    component: AdminLoginComponent,
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    children: [
      {
        path: '',
        component: AdminDashboardHomeComponent,
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'rides',
        component: AdminRidesComponent,
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'users',
        component: AdminUsersComponent,
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'captains',
        component: AdminCaptainsComponent,
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'captains-request',
        component: AdminCaptainsRequestComponent,
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'coupons',
        component: AdminCouponsComponent,
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'add-coupons',
        component: AdminAddCouponsComponent,
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'user-wallets',
        component: AdminUserWalletsComponent,
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'captain-wallets',
        component: AdminCaptainWalletsComponent,
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'add-admin',
        component: AdminAddAdminComponent,
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'admins',
        component: AdminAdminsComponent,
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'vehicles',
        component: AdminVehiclesComponent,
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'add-vehicle',
        component: AdminAddVehicleComponent,
        canActivate: [AuthGuardAdmin],
      },
    ],
  },

  { path: '**', redirectTo: 'home' }, // Handle 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
