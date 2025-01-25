import { Component } from '@angular/core';

@Component({
  selector: 'app-signup-user',
  templateUrl: './signup-user.component.html',
  styleUrl: './signup-user.component.css',
})
export class SignupUserComponent {
  emailDiv = true;
  passwordDiv = false;

  getDetails() {
    this.passwordDiv = true;
    this.emailDiv = false;
  }

  backToEmail() {
    this.emailDiv = true;
  }
}
