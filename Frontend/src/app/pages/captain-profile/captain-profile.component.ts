import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ProfileService } from '../../services/profile/profile.service';
import { EmailVerificationService } from '../../services/email-verification/email-verification.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-captain-profile',
  templateUrl: './captain-profile.component.html',
  styleUrl: './captain-profile.component.css',
})
export class CaptainProfileComponent {
  constructor(
    private profileService: ProfileService,
    private emailVerificationService: EmailVerificationService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.captainProfile();
  }

  captainDetail: any = {};
  documentsAvailable = false;

  captainProfile() {
    this.spinner.show();

    this.profileService.captainProfile().subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Profile data', result);
          this.captainDetail = result.captain;
          this.documentsAvailable =
            typeof this.captainDetail.documents !== 'undefined';

          // this.toaster.success(result.message);
        }
      },
      error: (error) => {
        console.log('Profile data error', error.error);

        if (error.error.statusCode == 404) {
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

  getEmailVerificationLink() {
    this.spinner.show();

    this.emailVerificationService.getCaptainEmailVerificationLink().subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Email link data', result);
          this.toaster.success(result.message);
        }
      },
      error: (error) => {
        console.log('Email link data error', error.error);

        if (error.error.statusCode == 400 || error.error.statusCode == 404) {
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

  showDocument(url: any) {
    Swal.fire({
      imageUrl: url,
      imageHeight: 450,
      imageWidth: 450,
      imageAlt: 'A tall image',
      customClass: {
        confirmButton: 'swal-confirm-btn',
      },
    });
  }
}
