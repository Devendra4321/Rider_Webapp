import { Component } from '@angular/core';
import { AdminLoginService } from '../../services/admin-login/admin-login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrl: './admin-login.component.css',
    standalone: false
})
export class AdminLoginComponent {
  constructor(
    private adminLoginService: AdminLoginService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private router: Router
  ) {}

  loginData = {
    email: '',
    password: '',
  };

  adminLogin(form: NgForm) {
    if (form.valid) {
      this.spinner.show();

      this.adminLoginService.login(this.loginData).subscribe({
        next: (result: any) => {
          this.spinner.hide();

          if (result.statuscode == 200) {
            console.log('Login success', result);
            localStorage.setItem('admin-token', result.token);
            this.toaster.success(result.message);
            this.router.navigate(['/dashboard']);
          } else {
            console.log('Login failed');
          }
        },
        error: (error: any) => {
          console.log('Login error', error.error);

          if (
            error.error.statuscode == 400 ||
            error.error.statuscode == 404 ||
            error.error.statuscode == 401
          ) {
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
}
