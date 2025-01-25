import { Component } from '@angular/core';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.css',
})
export class LoginUserComponent {
  emailDiv = true;
  otpDiv = false;
  passwordDiv = false;

  getOtp() {
    this.otpDiv = true;
    this.emailDiv = false;
  }

  verifyOtp() {
    this.passwordDiv = true;
    this.otpDiv = false;
  }

  backToEmail() {
    this.emailDiv = true;
    this.otpDiv = false;
  }
}
