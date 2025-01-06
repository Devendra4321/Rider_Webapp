import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { STRINGS } from '../../enum/strings';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  constructor(private http: HttpClient) {}

  getRides(data: any) {
    return this.http.post(STRINGS.APP_DEV_URL + '/admin/getAllRides', data);
  }
}
