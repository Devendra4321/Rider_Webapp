import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor() { }

  http = inject(HttpClient);

  addReview(data: any){
    const token = localStorage.getItem('user-token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post(environment.API_URL_Ride + 'addRideReview', data, { headers });
  }
}
