import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminLoginService {
  constructor() {}

  http = inject(HttpClient);

  login(data: any) {
    return this.http.post(environment.API_URL_ADMIN + 'login', data);
  }

  logout() {
    const token = localStorage.getItem('admin-token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(environment.API_URL_ADMIN + 'logout', {
      headers,
    });
  }
}
