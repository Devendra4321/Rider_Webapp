import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { STRINGS } from '../../enum/strings';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(STRINGS.APP_DEV_URL + '/admin/login', data);
  }

  logout() {
    return this.http.get(STRINGS.APP_DEV_URL + '/admin/logout');
  }
}
