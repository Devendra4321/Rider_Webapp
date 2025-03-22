import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailVerificationService } from '../../services/email-verification/email-verification.service';
import { CouponService } from '../../services/coupon/coupon.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css',
    standalone: false
})
export class UserProfileComponent {
  constructor(
    private profileService: ProfileService,
    private emailVerificationService: EmailVerificationService,
    private couponService: CouponService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.userProfile();
    this.getActiveCoupons();
  }

  userDetail: any = {};

  userProfile() {
    this.spinner.show();

    this.profileService.userProfile().subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Profile data', result);
          this.userDetail = result.user;
          // this.toaster.success(result.message);
        }
      },
      error: (error) => {
        console.log('Profile data error', error.error);

        if (error.error.statusCode == 404) {
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

  getEmailVerificationLink() {
    this.spinner.show();
    this.emailVerificationService.getUserEmailVerificationLink().subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Email link data', result);
          this.toaster.success(result.message);
        }
      },
      error: (error) => {
        console.log('Email link data error', error.error);

        if (error.error.statusCode == 400 || error.error.statusCode == 404) {
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

  activeCoupons: any = [];

  getActiveCoupons() {
    this.spinner.show();
    
    this.couponService.getAllActiveCoupons().subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Active coupons', result);
          this.activeCoupons = result.coupons;
        }
      },
      error: (error) => {
        console.log('Active coupons error', error.error);
        this.spinner.hide();
        this.toaster.error(error.error.message);
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  copyCouponCode(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // alert('Copied: ' + text);
      this.toaster.success('Coupon code copied', text);
    }).catch((error) => {
      console.error('Error in copying: ', error);
      this.toaster.error('Error in copying', text);
    });
  }
}
