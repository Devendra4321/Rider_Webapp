import { Component } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-user-wallets',
  standalone: false,
  templateUrl: './admin-user-wallets.component.html',
  styleUrl: './admin-user-wallets.component.css'
})
export class AdminUserWalletsComponent {

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getAllUserWallets();
  }

  wallets: any = [];

  getAllUserWallets() {
    this.spinner.show();

    const data = {
      page: this.activeWalletscurrentPage,
      perPage: this.activeWalletsTableSize,
    };

    this.adminService.getAllUserWallets(data).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('All user wallets data', result);
          this.wallets = result.data;
          this.totalActiveWallets = result.totalUserWallets;
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log('All user wallets data error', error.error);
        this.toastr.error(error.error.message);
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  };

  activeWalletscurrentPage: number = 1;
  activeWalletsTableSize: number = 5;
  totalActiveWallets: any = 0;

  onTableActiveUserWalletsDataChange(event: any) {
    this.activeWalletscurrentPage = event;
    this.getAllUserWallets();
  }
}
