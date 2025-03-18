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

  getPlaceName(lat: number, lon: number) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${environment.MAP_BOX_ACCESS_TOKEN}`;

    return this.http.get(url);
  }
}
