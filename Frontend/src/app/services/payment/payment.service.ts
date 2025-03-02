import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor() {}

  http = inject(HttpClient);

  paymentInit(data: any) {
    const token = localStorage.getItem('user-token');
    const headers = { Authorization: `bearer ${token}` };
    return this.http.post(environment.API_URL_Ride + 'paymentInit', data, {
      headers,
    });
  }

  paymentVerify(data: any) {
    const token = localStorage.getItem('user-token');
    const headers = { Authorization: `bearer ${token}` };
    return this.http.post(environment.API_URL_Ride + 'paymentVerify', data, {
      headers,
    });
  }

  walletPaymentInit(data: any) {
    const token = localStorage.getItem('captain-token');
    const headers = { Authorization: `bearer ${token}` };
    return this.http.post(environment.API_URL_WALLET + 'paymentInit', data, {
      headers,
    });
  }

  walletPaymentVerify(data: any) {
    const token = localStorage.getItem('captain-token');
    const headers = { Authorization: `bearer ${token}` };
    return this.http.post(environment.API_URL_WALLET + 'paymentVerify', data, {
      headers,
    });
  }
}
