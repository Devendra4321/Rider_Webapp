import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../../environment/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  constructor(
    private ngZone: NgZone,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private router: Router
  ) {
  }

  handleUserSignUpResponse(response: any): void {
    // console.log('Google JWT Token:', response.credential);
    this.spinner.show();

    const token = response.credential;
    fetch(`${environment.API_URL_AUTH}googleSignUp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    })
    .then(res => res.json())
    .then(data => {
      this.spinner.hide();
      if (data.statusCode === 200) {
        this.spinner.hide();
        this.toaster.success(data.message);
        this.router.navigate(['/login']);
        console.log('User register data:', data);
      } else {
        this.spinner.hide();
        this.toaster.error(data.message);
        console.error('User register data error:', data);
      }
    });

    // const user = this.decodeJwt(response.credential);
    // console.log('User Info:', user);
  }

  handleUserSignInResponse(response: any): void {
    // console.log('Google JWT Token:', response.credential);
    this.spinner.show();

    const token = response.credential;
    fetch(`${environment.API_URL_AUTH}userGoogleLogin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    })
    .then(res => res.json())
    .then(data => {
      this.spinner.hide();
      if (data.statusCode === 200) {
        this.spinner.hide();
        this.toaster.success(data.message);
        localStorage.setItem('user-token', data.token);
        console.log('User login data:', data);
        this.router.navigate(['/user-home']);
      } else {
        this.spinner.hide();
        this.toaster.error(data.message);
        console.error('User login data error:', data);
      }
    });

    // const user = this.decodeJwt(response.credential);
    // console.log('User Info:', user);
  }

  handleCaptainSignInResponse(response: any): void {
    // console.log('Google JWT Token:', response.credential);
    this.spinner.show();

    const token = response.credential;
    fetch(`${environment.API_URL_AUTH}captainGoogleLogin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    })
    .then(res => res.json())
    .then(data => {
      this.spinner.hide();
      if (data.statusCode === 200) {
        this.spinner.hide();
        this.toaster.success(data.message);
        localStorage.setItem('captain-token', data.token);
        console.log('captain login data:', data);
        this.router.navigate(['/captain-home']);
      } else {
        this.spinner.hide();
        this.toaster.error(data.message);
        console.error('Captain login data error:', data);
      }
    });

    // const user = this.decodeJwt(response.credential);
    // console.log('User Info:', user);
  }

  // private decodeJwt(token: string) {
  //   const base64Url = token.split('.')[1];
  //   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   return JSON.parse(atob(base64));
  // }
}
