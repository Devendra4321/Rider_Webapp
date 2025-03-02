import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CaptainWalletService {
  constructor() {}

  http = inject(HttpClient);

  getCaptainWallet() {
    const token = localStorage.getItem('captain-token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.get(environment.API_URL_WALLET + 'getCaptainWallet', {
      headers,
    });
  }

  getAllCaptainWalletTranscation(data: any) {
    const token = localStorage.getItem('captain-token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      environment.API_URL_WALLET + 'getAllCaptainWalletTransactions',
      data,
      {
        headers,
      }
    );
  }

  addAmountInCaptainWallet(data: any) {
    const token = localStorage.getItem('captain-token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      environment.API_URL_WALLET + 'AddInCaptainWallet',
      data,
      {
        headers,
      }
    );
  }

  withdrawalAmountInCaptainWallet(data: any) {
    const token = localStorage.getItem('captain-token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      environment.API_URL_WALLET + 'withdrawInCaptainWallet',
      data,
      {
        headers,
      }
    );
  }

  debitFromCaptainWallet(data: any) {
    const token = localStorage.getItem('captain-token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      environment.API_URL_WALLET + 'debitInCaptainWallet',
      data,
      {
        headers,
      }
    );
  }

  creditToCaptainWallet(data: any) {
    const token = localStorage.getItem('captain-token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(
      environment.API_URL_WALLET + 'creditInCaptainWallet',
      data,
      {
        headers,
      }
    );
  }
}
