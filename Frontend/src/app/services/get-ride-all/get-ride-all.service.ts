import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class GetRideAllService {
  constructor() {}

  http = inject(HttpClient);

  getAllUserRides(data: any) {
    const token = localStorage.getItem('user-token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(environment.API_URL_USER + 'getUserAllRides', data, {
      headers,
    });
  }

  getAllCaptainRides(data: any) {
    const token = localStorage.getItem('captain-token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(
      environment.API_URL_CAPTAIN + 'getCaptainAllRides',
      data,
      {
        headers,
      }
    );
  }
}
