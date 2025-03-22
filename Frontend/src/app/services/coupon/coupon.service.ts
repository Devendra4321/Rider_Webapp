import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor() { }

  http = inject(HttpClient);

  applyCoupon(code: string) {
    const token = localStorage.getItem('user-token');
    const headers = {
      Authorization: `Bearer ${token}`
    }
    return this.http.post(environment.API_URL_COUPON + 'applyCoupon', { code },{ headers });
  }

  useCoupon(code: string) {
    const token = localStorage.getItem('user-token');
    const headers = {
      Authorization: `Bearer ${token}`
    }
    return this.http.post(environment.API_URL_COUPON + 'useCoupon', { code },{ headers });
  }

  getAllActiveCoupons() {
    const token = localStorage.getItem('user-token');
    const headers = {
      Authorization: `Bearer ${token}`
    }
    return this.http.get(environment.API_URL_COUPON + 'getActiveCoupons',{ headers });
  }
}
