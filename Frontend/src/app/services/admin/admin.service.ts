import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor() {}

  http = inject(HttpClient);

  getRides(data: any) {
    return this.http.post(environment.API_URL_ADMIN + 'getAllRides', data);
  }

  getAllUsers(data: any) {
    return this.http.post(environment.API_URL_ADMIN + 'getAllUsers', data);
  }

  getAllCaptains(data: any) {
    return this.http.post(environment.API_URL_ADMIN + 'getAllCaptains', data);
  }

  getCaptains(data: any) {
    return this.http.post(
      environment.API_URL_ADMIN + 'getAllCaptainsRequest',
      data
    );
  }

  getCaptainById(id: any) {
    return this.http.get(`${environment.API_URL_ADMIN}getCaptainById/${id}`);
  }

  uploadDocumnet(data: any) {
    const token = localStorage.getItem('admin-token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      environment.API_URL_ADMIN + 'uploadCaptainDocument',
      data,
      { headers }
    );
  }

  updateCaptainStatus(status: any, id: string) {
    const token = localStorage.getItem('admin-token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      `${environment.API_URL_ADMIN}updateCaptainStatus/${id}`,
      status,
      {
        headers,
      }
    );
  }

  getCoupons(data: any) {
    const token = localStorage.getItem('admin-token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      environment.API_URL_COUPON + 'getAllCoupons',
      data,
      {
        headers,
      }
    );
  }

  addCoupons(data: any) {
    const token = localStorage.getItem('admin-token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      environment.API_URL_COUPON + 'addCoupon',
      data,
      {
        headers,
      }
    );
  }

  getCouponById(id: any) {
    const token = localStorage.getItem('admin-token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.get(
      `${environment.API_URL_COUPON}getCouponById/${id}`,
      {
        headers,
      }
    );
  }

  updateCoupon(data: any) {
    const token = localStorage.getItem('admin-token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.put(
      `${environment.API_URL_COUPON}updateCoupon/${data._id}`,
      data,
      {
        headers,
      }
    );
  }
}
