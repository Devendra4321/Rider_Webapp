import { Component } from '@angular/core';

@Component({
  selector: 'app-signup-captain',
  templateUrl: './signup-captain.component.html',
  styleUrl: './signup-captain.component.css',
})
export class SignupCaptainComponent {
  emailDiv = true;
  vehicleDiv = false;
  passwordDiv = false;

  getDetails() {
    this.vehicleDiv = true;
    this.emailDiv = false;
  }

  backToEmail() {
    this.emailDiv = true;
    this.vehicleDiv = false;
  }

  nextToPassword() {
    this.passwordDiv = true;
    this.vehicleDiv = false;
  }
}
