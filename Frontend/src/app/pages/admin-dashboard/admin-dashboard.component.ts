import { Component } from '@angular/core';
import { AdminLoginService } from '../../services/admin-login/admin-login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  constructor(
    private adminLoginService: AdminLoginService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private router: Router
  ) {}

  logOutAdmin() {
    this.spinner.show();

    this.adminLoginService.logout().subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Admin logout', result);
          localStorage.removeItem('admin-token');
          this.toaster.success(result.message);
          this.router.navigate(['/admin-login']);
        }
      },
      error: (error: any) => {
        console.log('Admin logout error', error.error);

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
