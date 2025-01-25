import { Component } from '@angular/core';

@Component({
  selector: 'app-login-captain',
  templateUrl: './login-captain.component.html',
  styleUrl: './login-captain.component.css',
})
export class LoginCaptainComponent {
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
