import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CaptainLoginService {
  constructor() {}

  http = inject(HttpClient);

  iscaptainLoggedIn(): boolean {
    return !!localStorage.getItem('captain-token');
  }

  captainLogin(data: any) {
    return this.http.post(environment.API_URL_CAPTAIN + 'login', data);
  }

  captainOtp(data: any) {
    return this.http.post(environment.API_URL_CAPTAIN + 'sendOtp', data);
  }

  captainVerifyOtp(data: any) {
    return this.http.post(environment.API_URL_CAPTAIN + 'verifyOtp', data);
  }
}
