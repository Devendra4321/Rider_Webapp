import { Component } from '@angular/core';
import { LogoutService } from '../../services/logout/logout.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-captain',
  templateUrl: './navbar-captain.component.html',
  styleUrl: './navbar-captain.component.css',
})
export class NavbarCaptainComponent {
  constructor(
    private logoutService: LogoutService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {}

  logOutCaptain() {
    this.spinner.show();

    this.logoutService.captainLogout().subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('logout data', result);
          this.toaster.success(result.message);
          localStorage.removeItem('captain-token');
          this.route.navigate(['/home']);
        }
      },
      error: (error) => {
        console.log('logout error', error.error);

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
