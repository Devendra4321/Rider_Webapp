import { Component } from '@angular/core';
import { EmailVerificationService } from '../../services/email-verification/email-verification.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.css',
})
export class EmailVerificationComponent {
  constructor(
    private emailVerificationService: EmailVerificationService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getParms();
  }

  token = '';
  userType = '';

  getParms() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.userType = params['userType'];
      console.log('Token:', this.token);
      console.log('User Type:', this.userType);
    });

    this.verifyEmail();
  }

  isLoading = true;
  isSuccess = false;
  isError = false;
  isVerified = false;

  verifyEmail() {
    this.spinner.show();

    if (this.userType == 'user') {
      this.emailVerificationService
        .verifyUserEmail({ token: this.token })
        .subscribe({
          next: (result: any) => {
            if (result.statusCode == 200) {
              this.spinner.hide();
              console.log('Verify email data', result);
              this.toaster.success(result.message);
              this.isLoading = false;
              this.isSuccess = true;
            }
          },
          error: (error) => {
            console.log('Verify email data error', error.error);

            if (error.error.statusCode == 400) {
              this.spinner.hide();
              this.toaster.error(error.error.message);
              this.isError = true;
              this.isLoading = false;
            } else if (
              error.error.statusCode == 404 &&
              error.error.message == 'Email is already verified'
            ) {
              this.spinner.hide();
              this.isLoading = false;
              this.isVerified = true;
            } else if (error.error.statusCode == 404) {
              this.spinner.hide();
              this.isLoading = false;
              this.isError = true;
            } else {
              this.toaster.error('Something went wrong');
              this.isError = true;
            }
          },
          complete: () => {
            this.spinner.hide();
          },
        });
    }
  }
}
