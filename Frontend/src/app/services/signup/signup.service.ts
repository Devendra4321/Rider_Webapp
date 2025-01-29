import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  constructor() {}

  http = inject(HttpClient);

  userRegister(data: any) {
    return this.http.post(environment.API_URL_USER + 'register', data);
  }

  captainRegister(data: any) {
    return this.http.post(environment.API_URL_CAPTAIN + 'register', data);
  }
}
