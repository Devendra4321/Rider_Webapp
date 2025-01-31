import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadDocumentsService {
  constructor() {}

  http = inject(HttpClient);

  uploadDocuments(file: File, documentType: any) {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentName', documentType);

    const token = localStorage.getItem('captain-token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.post(
      environment.API_URL_CAPTAIN + 'uploadDocuments',
      formData,
      { headers }
    );
  }
}
