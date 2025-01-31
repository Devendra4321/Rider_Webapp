import { Component } from '@angular/core';
import { environment } from '../../../environment/environment';
import { UploadDocumentsService } from '../../services/upload-documents/upload-documents.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-captain-upload-document',
  templateUrl: './captain-upload-document.component.html',
  styleUrl: './captain-upload-document.component.css',
})
export class CaptainUploadDocumentComponent {
  constructor(
    private uploadDocumentsService: UploadDocumentsService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  selectedFile: File | null = null;
  isUploaded = false;

  onFileSelected(event: any, documentType: String) {
    this.selectedFile = event.target.files[0];
    // console.log(this.selectedFile);
    this.uploadFile(documentType);
  }

  uploadFile(documentType: String) {
    if (!this.selectedFile) {
      console.log('Please select a file first.');
      return;
    }

    this.spinner.show();
    this.uploadDocumentsService
      .uploadDocuments(this.selectedFile, documentType)
      .subscribe({
        next: (result: any) => {
          if (result.statusCode == 200) {
            this.spinner.hide();
            console.log('Upload image data', result);
            this.toaster.success(result.message);
            this.isUploaded = true;
          }
        },
        error: (error) => {
          console.log('Upload image data error', error.error.message);

          if (error.error.statusCode == 400) {
            this.spinner.hide();
            this.toaster.error(error.error.message);
          } else {
            this.toaster.error('Something went wrong');
          }
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }
}
