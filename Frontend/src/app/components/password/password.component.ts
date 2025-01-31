import { Component, Input, input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ForgotPasswordService } from '../../services/forgotpassword/forgot-password.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
})
export class PasswordComponent {
  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  @Input() userType: string | undefined;

  passwordDetails = {
    newPassword: '',
    confirmPassword: '',
  };

  forgotPassword(form: NgForm) {
    if (form.valid && this.userType == 'user') {
      console.log(this.passwordDetails);

      this.spinner.show();

      this.forgotPasswordService
        .userForgotPassword({
          newPassword: this.passwordDetails.newPassword,
        })
        .subscribe({
          next: (result: any) => {
            if (result.statusCode == 200) {
              this.spinner.hide();
              console.log('Forgot password data', result);
              this.toaster.success(result.message);
            }
          },
          error: (error) => {
            console.log('Forgot password data error', error.error);

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
    if (form.valid && this.userType == 'captain') {
      console.log(this.passwordDetails);

      this.spinner.show();

      this.forgotPasswordService
        .captainForgotPassword({
          newPassword: this.passwordDetails.newPassword,
        })
        .subscribe({
          next: (result: any) => {
            if (result.statusCode == 200) {
              this.spinner.hide();
              console.log('Forgot password data', result);
              this.toaster.success(result.message);
            }
          },
          error: (error) => {
            console.log('Forgot password data error', error.error);

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

  isPasswordMatch() {
    return (
      this.passwordDetails.newPassword !== this.passwordDetails.confirmPassword
    );
  }
}
