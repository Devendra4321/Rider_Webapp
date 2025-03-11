import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserWalletService {
  constructor() {}

  http = inject(HttpClient);

  getUserWallet() {
    const token = localStorage.getItem('user-token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.get(environment.API_URL_WALLET + 'getUserWallet', {
      headers,
    });
  }

  getAllCaptainWalletTranscation(data: any) {
    const token = localStorage.getItem('user-token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      environment.API_URL_WALLET + 'getAllUserWalletTransactions',
      data,
      {
        headers,
      }
    );
  }

  addAmountInUserWallet(data: any) {
    const token = localStorage.getItem('user-token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      environment.API_URL_WALLET + 'AddInUserWallet',
      data,
      {
        headers,
      }
    );
  }

  debitFromUserWallet(data: any) {
    const token = localStorage.getItem('user-token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      environment.API_URL_WALLET + 'debitInUserWallet',
      data,
      {
        headers,
      }
    );
  }

  creditToUserWallet(data: any) {
    const token = localStorage.getItem('user-token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      environment.API_URL_WALLET + 'creditInUserWallet',
      data,
      {
        headers,
      }
    );
  }
}
