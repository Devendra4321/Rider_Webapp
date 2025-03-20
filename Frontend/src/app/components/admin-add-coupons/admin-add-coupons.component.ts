import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-add-coupons',
  standalone: false,
  templateUrl: './admin-add-coupons.component.html',
  styleUrl: './admin-add-coupons.component.css'
})
export class AdminAddCouponsComponent {

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  couponDetails = {
    code: '',
    discount: '',
    type:'select discount type',
    expirationDate: '',
    usageLimit: '',
  };

  addCoupon(form: NgForm){
    if(form.valid){
      // console.log("Coupon form details", this.couponDetails);
      this.addCouponsData();
    }
  }

  addCouponsData(){
    this.spinner.show()

    this.adminService.addCoupons(this.couponDetails).subscribe({
      next: (result: any) => {
        if(result.statusCode == 201){
          this.spinner.hide();
          console.log("Coupon added data", result);
          this.toastr.success(result.message);
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log("Coupon added data error", error.error);
        this.toastr.error(error.error.message);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }
}
