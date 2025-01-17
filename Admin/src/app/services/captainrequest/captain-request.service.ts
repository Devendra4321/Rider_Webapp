import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { STRINGS } from '../../enum/strings';

@Injectable({
  providedIn: 'root',
})
export class CaptainRequestService {
  constructor(private http: HttpClient) {}

  getCaptains(data: any) {
    return this.http.post(
      STRINGS.APP_DEV_URL + '/admin/getAllCaptainsRequest',
      data
    );
  }

  getCaptainById(id: any) {
    return this.http.get(`${STRINGS.APP_DEV_URL}/admin/getCaptainById/${id}`);
  }

  uploadDocumnet(data: any) {
    const headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    };
    return this.http.post(
      STRINGS.APP_DEV_URL + '/admin/uploadCaptainDocument',
      data,
      { headers }
    );
  }
}
