import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor() {}

  http = inject(HttpClient);

  getSuggestion(data: any) {
    return this.http.get(
      `${environment.API_URL_MAP}/getSuggestion?query=${data}`
    );
  }

  getCordinates(data: any) {
    return this.http.get(
      `${environment.API_URL_MAP}/getCoordinates?address=${data}`
    );
  }
}
