import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-admin-captain-wallets',
  standalone: false,
  templateUrl: './admin-captain-wallets.component.html',
  styleUrl: './admin-captain-wallets.component.css'
})
export class AdminCaptainWalletsComponent {

 constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getAllCaptainWallets();
  }

  wallets: any = [];

  getAllCaptainWallets() {
    this.spinner.show();

    const data = {
      page: this.activeWalletscurrentPage,
      perPage: this.activeWalletsTableSize,
    };

    this.adminService.getAllCaptainWallets(data).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('All captain wallets data', result);
          this.wallets = result.data;
          this.totalActiveWallets = result.totalCaptainWallets;
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log('All captain wallets data error', error.error);
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

  onTableActiveCaptainWalletsDataChange(event: any) {
    this.activeWalletscurrentPage = event;
    this.getAllCaptainWallets();
  } 
}
