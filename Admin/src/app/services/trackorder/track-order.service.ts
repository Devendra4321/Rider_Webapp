import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { STRINGS } from '../../enum/strings';

@Injectable({
  providedIn: 'root',
})
export class TrackOrderService {
  constructor(private http: HttpClient) {}

  getRide(id: any) {
    return this.http.get(`${STRINGS.APP_DEV_URL}/ride/getRideById/${id}`);
  }
}
