import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SignupService } from '../../services/signup/signup.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-user',
  templateUrl: './signup-user.component.html',
  styleUrl: './signup-user.component.css',
})
export class SignupUserComponent {
  constructor(
    private signUpService: SignupService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {}

  emailDiv = true;
  passwordDiv = false;

  signUpData = {
    firstName: '',
    lastName: '',
    emailMob: '',
    password: '',
  };

  getDetails(form: NgForm) {
    if (form.valid) {
      // console.log(this.signUpData);
      this.passwordDiv = true;
      this.emailDiv = false;
    }
  }

  backToEmail() {
    this.emailDiv = true;
    this.passwordDiv = false;
  }

  userSignUp(form: NgForm) {
    if (form.valid) {
      // console.log(this.signUpData);

      this.spinner.show();

      const data = {
        fullname: {
          firstname: this.signUpData.firstName,
          lastname: this.signUpData.lastName,
        },
        email: this.signUpData.emailMob,
        password: this.signUpData.password,
      };
      console.log(data);

      this.signUpService.userRegister(data).subscribe({
        next: (result: any) => {
          if (result.statusCode == 201) {
            this.spinner.hide();
            console.log('Sign-up data', result);
            this.toaster.success(result.message);
            this.route.navigate(['/login/user']);
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log('Sign-up data error', error.error);

          if (error.error.statusCode == 400) {
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
}
