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

  //User routes

  {
    path: 'user-home',
    component: UserHomeComponent,
  },
  {
    path: 'ride-review',
    component: RideReviewComponent,
  },
  {
    path: 'ride-ongoing',
    component: RideOngoingComponent,
  },
  {
    path: 'trips',
    component: TripsComponent,
  },
  {
    path: 'trips/:rideId',
    component: TripsByIdComponent,
  },
  {
    path: 'wallet-user',
    component: WalletUserComponent,
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },

  //Captain routes

  {
    path: 'captain-home',
    component: CaptainHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
