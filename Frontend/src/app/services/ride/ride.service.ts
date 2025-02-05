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

  createRide(data: any) {
    const token = localStorage.getItem('user-token');
    const headers = { authorization: `Bearer ${token}` };
    return this.http.post(environment.API_URL_Ride + 'create', data, {
      headers,
    });
  }

  acceptRide(data: any) {
    const token = localStorage.getItem('captain-token');
    const headers = { authorization: `Bearer ${token}` };
    return this.http.post(environment.API_URL_Ride + 'confirm', data, {
      headers,
    });
  }

  startRide(data: any) {
    const token = localStorage.getItem('captain-token');
    const headers = { authorization: `Bearer ${token}` };
    return this.http.post(environment.API_URL_Ride + 'startRide', data, {
      headers,
    });
  }

  sendNotificationToCaptain(data: any) {
    return this.http.post(environment.API_URL_Ride + 'sendNotification', data);
  }

  upadatePaymentStatusAndId(data: any) {
    return this.http.post(
      environment.API_URL_Ride + 'upadatePaymentStatus',
      data
    );
  }

  rideGetById(rideId: any) {
    return this.http.get(`${environment.API_URL_Ride}getRideById/${rideId}`);
  }
}
