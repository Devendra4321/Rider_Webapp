import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CaptainLoginService } from '../../services/captain-login/captain-login.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { RideSocketService } from '../../services/ride-socket/ride-socket.service';

@Component({
    selector: 'app-login-captain',
    templateUrl: './login-captain.component.html',
    styleUrl: './login-captain.component.css',
    standalone: false
})
export class LoginCaptainComponent {
  constructor(
    private captainLoginService: CaptainLoginService,
    private rideSocketService: RideSocketService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {}

  emailDiv = true;
  otpDiv = false;
  passwordDiv = false;

  loginData: any = {
    emailMob: '',
    otp: '',
    password: '',
  };

  getOtp(form: NgForm) {
    if (form.valid) {
      this.captainLoginService
        .captainOtp({ email: this.loginData.emailMob })
        .subscribe({
          next: (result: any) => {
            this.spinner.show();

            if (result.statusCode == 200) {
              this.spinner.hide();
              console.log('Otp data', result);
              this.toaster.success(result.message);
              this.otpDiv = true;
              this.emailDiv = false;
            }
          },

          error: (error: any) => {
            this.spinner.hide();
            console.log('Get otp error:', error.error);

            if (
              error.error.statusCode == 400 ||
              error.error.statusCode == 404 ||
              error.error.statusCode == 500
            ) {
              this.toaster.error(error.error.message);
            }
          },

          complete: () => {
            this.spinner.hide();
          },
        });
    }
  }

  wrongOtp = false;

  verifyOtp() {
    this.spinner.show();
    this.captainLoginService
      .captainVerifyOtp({
        email: this.loginData.emailMob,
        otp: Number(this.loginData.otp),
      })
      .subscribe({
        next: (result: any) => {
          if (result.statusCode === 200) {
            this.spinner.hide();
            console.log('Verify OTP', result);
            this.toaster.success(result.message);
            this.passwordDiv = true;
            this.otpDiv = false;
            this.wrongOtp = false;
          }
        },
        error: (error: any) => {
          this.spinner.hide();
          console.log('Verify OTP Error', error.error);

          if (error.error.statusCode === 400 || error.statusCode === 404) {
            this.toaster.error(error.error.message);
            this.wrongOtp = true;
          }
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }

  captainLogin(form: NgForm) {
    if (form.valid) {
      this.spinner.show();
      this.captainLoginService
        .captainLogin({
          email: this.loginData.emailMob,
          password: this.loginData.password,
        })
        .subscribe({
          next: (result: any) => {
            if (result.statusCode == 200) {
              this.spinner.hide();
              console.log('login data', result);
              localStorage.setItem('captain-token', result.token);
              this.toaster.success(result.message);
              this.captainSocketJoin(result.captain._id, 'captain');
              this.route.navigate(['/captain-home']);
            }
          },
          error: (error: any) => {
            this.spinner.hide();
            console.log('Login user Error', error.error);

            if (
              error.error.statusCode == 404 ||
              error.error.statusCode == 400
            ) {
              this.toaster.error(error.error.message);
            }
          },
        });
    }
  }

  captainSocketJoin(captainId: any, userType: any) {
    this.rideSocketService.joinRoom(captainId, userType);
  }

  backToEmail() {
    this.emailDiv = true;
    this.otpDiv = false;
  }

  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';

  moveFocus(event: any, nextInput: any, index: number) {
    const value = event.target.value;
    if (value.length === 1 && nextInput) {
      nextInput.focus();
    }
    this.combineOTP();
  }

  combineOTP() {
    this.loginData.otp = `${this.otp1}${this.otp2}${this.otp3}${this.otp4}`;
  }
}
