import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor() {}

  http = inject(HttpClient);

  userLogout() {
    const token = localStorage.getItem('user-token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(environment.API_URL_USER + 'logout', {
      headers,
    });
  }
}
