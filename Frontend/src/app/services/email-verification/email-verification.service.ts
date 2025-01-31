import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailVerificationService {
  constructor() {}

  http = inject(HttpClient);

  getUserEmailVerificationLink() {
    const token = localStorage.getItem('user-token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(environment.API_URL_USER + 'emailVerificationLink', {
      headers,
    });
  }

  verifyUserEmail(data: any) {
    return this.http.post(environment.API_URL_USER + 'verifyEmail', data);
  }

  getCaptainEmailVerificationLink() {
    const token = localStorage.getItem('captain-token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(
      environment.API_URL_CAPTAIN + 'emailVerificationLink',
      {
        headers,
      }
    );
  }

  verifyCaptainEmail(data: any) {
    return this.http.post(environment.API_URL_CAPTAIN + 'verifyEmail', data);
  }
}
