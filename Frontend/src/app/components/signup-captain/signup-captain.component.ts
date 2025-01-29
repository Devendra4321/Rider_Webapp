import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SignupService } from '../../services/signup/signup.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-captain',
  templateUrl: './signup-captain.component.html',
  styleUrl: './signup-captain.component.css',
})
export class SignupCaptainComponent {
  constructor(
    private signUpService: SignupService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {}

  emailDiv = true;
  vehicleDiv = false;
  passwordDiv = false;

  signUpData = {
    fullname: {
      firstname: '',
      lastname: '',
    },
    email: '',
    password: '',
    vehicle: {
      color: '',
      plate: '',
      capacity: '',
      vehicleType: '',
    },
  };

  getDetails(form: NgForm) {
    if (form.valid) {
      this.emailDiv = false;
      this.vehicleDiv = true;
      this.passwordDiv = false;
    }
  }

  // backToEmail() {
  //   this.emailDiv = true;
  //   this.vehicleDiv = false;
  //   this.passwordDiv = false;
  // }

  nextToPassword(form: NgForm) {
    if (form.valid) {
      this.emailDiv = false;
      this.vehicleDiv = false;
      this.passwordDiv = true;
    }
  }

  backToVehicle() {
    this.emailDiv = true;
    this.vehicleDiv = false;
    this.passwordDiv = false;
  }

  captainSignUp(form: NgForm) {
    if (form.valid) {
      // console.log(this.signUpData);

      this.spinner.show();

      this.signUpService.captainRegister(this.signUpData).subscribe({
        next: (result: any) => {
          if (result.statusCode == 201) {
            this.spinner.hide();
            console.log('Signup data', result);
            this.toaster.success(result.message);
            this.route.navigate(['/login/captain']);
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log('Signup data error', error.error);

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
