import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  constructor() {}

  http = inject(HttpClient);

  getVehiclePrices(data: any) {
    const token = localStorage.getItem('user-token');
    const headers = { authorization: `Bearer ${token}` };
    return this.http.post(environment.API_URL_Ride + 'getVehiclePrices', data, {
      headers,
    });
  }
}
