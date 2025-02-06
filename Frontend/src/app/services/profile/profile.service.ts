import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor() {}

  http = inject(HttpClient);

  userProfile() {
    const token = localStorage.getItem('user-token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(environment.API_URL_USER + 'getUserProfile', {
      headers,
    });
  }

  captainProfile() {
    const token = localStorage.getItem('captain-token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(environment.API_URL_CAPTAIN + 'getCaptainProfile', {
      headers,
    });
  }

  setCaptainOnlineStatus(data: any) {
    const token = localStorage.getItem('captain-token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      environment.API_URL_CAPTAIN + 'updateOnlineStatus',
      data,
      {
        headers,
      }
    );
  }
}
