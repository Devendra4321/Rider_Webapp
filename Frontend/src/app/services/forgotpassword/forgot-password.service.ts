import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  constructor() {}

  http = inject(HttpClient);

  userForgotPassword(data: any) {
    const token = localStorage.getItem('user-token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.patch(environment.API_URL_USER + 'forgotPassword', data, {
      headers,
    });
  }

  captainForgotPassword(data: any) {
    const token = localStorage.getItem('captain-token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.patch(
      environment.API_URL_CAPTAIN + 'forgotPassword',
      data,
      {
        headers,
      }
    );
  }
}
