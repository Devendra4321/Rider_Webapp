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
    return this.http.post(environment.API_URL_Ride + 'paymentInit', data);
  }

  paymentVerify(data: any) {
    return this.http.post(environment.API_URL_Ride + 'paymentVerify', data);
  }
}
