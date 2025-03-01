import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CaptainWalletService {
  constructor() {}

  http = inject(HttpClient);
  token = localStorage.getItem('captain-token');
  headers = {
    Authorization: `Bearer ${this.token}`,
  };
}
