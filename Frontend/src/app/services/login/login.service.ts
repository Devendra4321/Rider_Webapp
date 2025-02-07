import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor() {}

  http = inject(HttpClient);

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('user-token');
  }

  userLogin(data: any) {
    return this.http.post(environment.API_URL_USER + 'login', data);
  }

  userOtp(data: any) {
    return this.http.post(environment.API_URL_USER + 'sendOtp', data);
  }

  userVerifyOtp(data: any) {
    return this.http.post(environment.API_URL_USER + 'verifyOtp', data);
  }
}
