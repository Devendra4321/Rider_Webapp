import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SignupService } from '../../services/signup/signup.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../../services/google-auth/google-auth.service';
import { environment } from '../../../environment/environment';
import { FacebookAuthService } from '../../services/facebook-auth/facebook-auth.service';
export declare const google: any;


@Component({
    selector: 'app-signup-user',
    templateUrl: './signup-user.component.html',
    styleUrl: './signup-user.component.css',
    standalone: false
})
export class SignupUserComponent {
  constructor(
    private signUpService: SignupService,
    private googleAuthService: GoogleAuthService,
    private facebookAuthService: FacebookAuthService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {}

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: environment.CLIENT_ID,
      callback: (response: any) => this.googleAuthService.handleUserSignUpResponse(response),
    });

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: 'filled_blue',
      size: 'large',
      text: 'signup_with',
    });
  }

  async signUpWithFacebook() {
    try {
      // Step 1: Login with Facebook
      const authResponse = await this.facebookAuthService.withFacebook();
      
      // Step 2: Get user data
      // const userData = await this.facebookAuthService.getFacebookUserData();

      if(authResponse){
        this.spinner.show();

        this.facebookAuthService.signUpWithFacebook({accessToken: authResponse.accessToken}).subscribe({
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
            this.toaster.error(error.error.message);
          },
          complete: () => {
            this.spinner.hide();
          }
        });
      }
    } catch (error) {
      console.error('Error during Facebook login:', error);
    }
  }  

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

  // signInWithGoogle() {
  //   this.googleAuthService.signIn();
  // }
}
