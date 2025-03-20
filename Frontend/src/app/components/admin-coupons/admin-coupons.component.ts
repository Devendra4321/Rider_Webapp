import { Component } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-coupons',
  standalone: false,
  templateUrl: './admin-coupons.component.html',
  styleUrl: './admin-coupons.component.css'
})
export class AdminCouponsComponent {
  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}
  
  ngOnInit() {
    this.getAllCoupons();
  }

  coupons: any = [];

  getAllCoupons() {
    this.spinner.show();

    const data = {
      page: this.activeCouponscurrentPage,
      perPage: this.activeCouponsTableSize,
    };
    this.adminService.getCoupons(data).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.spinner.hide();
        console.log('All coupons', result);
        this.coupons = result.coupons;
        // console.log('coupons', this.coupons);

        this.totalActiveCoupons = result.totalCoupons;
      } else {
        this.spinner.hide();
        console.log('Failed to fetched data');
      }
    });
  }

  activeCouponscurrentPage: number = 1;
  activeCouponsTableSize: number = 5;
  totalActiveCoupons: any = 0;

  onTableActiveCouponsDataChange(event: any) {
    this.activeCouponscurrentPage = event;
    this.getAllCoupons();
  }

  couponDetails: any = {};

  getCouponById(couponId: any) {
    this.spinner.show();

    this.adminService.getCouponById(couponId).subscribe({
      next: (result: any) => {
        if (result.statusCode === 200) {
          this.spinner.hide();
          console.log('Coupon details', result);
          this.couponDetails = result.coupon;
          this.couponDetails.expirationDate = this.formatDate(this.couponDetails.expirationDate);
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log('Coupon details error', error.error);
        this.toastr.error(error.error.message);
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  };

  formatDate(dateString: string | Date): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extracts YYYY-MM-DD
  }

  updateCoupon(form: NgForm){
      if(form.valid){
        console.log("Coupon updat form details", this.couponDetails);
        this.updateCouponsData();
      }
  }

  updateCouponsData(){
    this.spinner.show()

    // const data = {
    //   discount: this.couponDetails.discount,
    //   type: this.couponDetails.type,
    //   expirationDate: this.couponDetails.expirationDate,
    //   usageLimit: this.couponDetails.usageLimit,
    //   isActive: this.couponDetails.isActive,
    // };

    this.adminService.updateCoupon(this.couponDetails).subscribe({
      next: (result: any) => {
        if(result.statusCode == 200){
          this.spinner.hide();
          console.log("Coupon updated data", result);
          this.toastr.success(result.message);
          this.getAllCoupons();
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log("Coupon updated data error", error.error);
        this.toastr.error(error.error.message);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }
}
