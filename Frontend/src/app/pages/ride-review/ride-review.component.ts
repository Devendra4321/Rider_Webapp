import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MapComponent } from '../../components/map/map.component';
import { RideService } from '../../services/ride/ride.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from '../../services/payment/payment.service';
import { environment } from '../../../environment/environment';
import { RideSocketService } from '../../services/ride-socket/ride-socket.service';
import { ProfileService } from '../../services/profile/profile.service';
import { UserWalletService } from '../../services/user-wallet/user-wallet.service';
import { CouponService } from '../../services/coupon/coupon.service';
declare var Razorpay: any;
@Component({
  selector: 'app-ride-review',
  templateUrl: './ride-review.component.html',
  styleUrl: './ride-review.component.css',
  standalone: false,
})
export class RideReviewComponent {
  constructor(
    private rideService: RideService,
    private paymentService: PaymentService,
    private rideSocketService: RideSocketService,
    private userWalletService: UserWalletService,
    private profileService: ProfileService,
    private couponService: CouponService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private route: Router
  ) {}

  @ViewChild(MapComponent) childComponent!: MapComponent;

  locationDetails: any = {};
  ngAfterViewInit() {
    this.getLocationDetails();
  }

  ngOnInit() {
    this.getUserDetails();
    this.getUserWallet();

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.defer = true;
    document.body.appendChild(script);
  }

  rideDetails = {
    pickup: '',
    drop: '',
    vehicleType: '',
    paymentMethod: 'cash',
    isCouponWanted: false,
    couponCode: '',
  };

  getLocationDetails() {
    if (history.state) {
      this.locationDetails = history.state.location;
      this.rideDetails.pickup = this.locationDetails.pickupLoc;
      this.rideDetails.drop = this.locationDetails.dropLoc;
      console.log('Location details:', this.locationDetails);
    }

    this.getRoute();
    this.getVehiclePrices();
  }

  getRoute() {
    setTimeout(() => {
      if (this.locationDetails) {
        this.childComponent.getPickupCordinates(this.locationDetails.pickupLoc);
        this.childComponent.getDropCordinates(this.locationDetails.dropLoc);
      }
    }, 800);
  }

  rideGeneratePopup() {
    let timerInterval: any;
    Swal.fire({
      title: 'Ride Generated!',
      html: 'Please wait, captain will accept the ride.',
      icon: 'success',
      timer: 60000,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCloseButton: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup()?.querySelector('b');
        timerInterval = setInterval(() => {
          if (timer) {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('Ride request timed out.');
        this.showRideNotAcceptPopup();
      }
    });
  }

  showRideNotAcceptPopup() {
    Swal.fire({
      title: 'Ride Not Accepted!',
      text: 'Ride is not accepted by any captain',
      icon: 'warning',
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCloseButton: true,
      customClass: {
        confirmButton: 'swal-confirm-btn',
      },
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  rideAccepetedPopup() {
    let timerInterval: any;
    Swal.fire({
      title: 'Ride Accepted by Captain!',
      html: 'Your ride has been accepted by the captain. You will be notified when the captain arrives at your location.',
      icon: 'success',
      timer: 6000,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCloseButton: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup()?.querySelector('b');
        timerInterval = setInterval(() => {
          if (timer) {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
  }

  vehiclePrices: any = {};

  vehiclesData: any;
  activeVehicleIndex: number | undefined;

  getVehiclePrices() {
    this.spinner.show();

    this.rideService
      .getVehiclePrices({
        pickup: this.locationDetails.pickupLoc,
        destination: this.locationDetails.dropLoc,
      })
      .subscribe({
        next: (result: any) => {
          if (result.statusCode == 200) {
            this.spinner.hide();
            this.vehiclesData = result.data;
            this.vehiclePrices = this.vehiclesData.map((vehicle: any) => {
              return {
                vehicleName: vehicle.vehicleType, 
                fare: vehicle.discountedFare,
                baseFare: vehicle.fare
              };
            });           
            console.log('Vehicle data', result);
          }
        },
        error: (error) => {
          console.log('Vehicle data error', error.error);

          if (error.error.statusCode == 400 || error.error.statusCode == 500) {
            this.spinner.hide();
            console.log(error.error.message);
          } else {
            console.log('Something went wrong');
          }
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }

  isWalletAmountLess = false;
  selectedVehicle: any;

  getVehicleDetails(index: number, vehicleType: any) {
    this.rideDetails.vehicleType = vehicleType;
    this.activeVehicleIndex = index;
    this.selectedVehicle = this.vehiclePrices.find((vehicle: any) => vehicle.vehicleName === vehicleType);

    if (
      this.rideDetails.paymentMethod == 'wallet' &&
      this.walletBalance < this.selectedVehicle.fare
    ) {
      this.isWalletAmountLess = true;
    } else {
      this.isWalletAmountLess = false;
    }

    // console.log(this.rideDetails);
  }

  appliedCouponData: any = {};

  applyCoupon() {
    this.spinner.show();

    this.couponService
      .applyCoupon(this.rideDetails.couponCode)
      .subscribe({
        next: (result: any) => {
          if (result.statusCode == 200) {
            this.spinner.hide();
            console.log('Coupon data', result);
            this.toaster.success(result.message);
            this.appliedCouponData={
              couponCode: this.rideDetails.couponCode,
              discount: result.discount,
              discountType: result.type,
              isCouponApplied: true,
            }
            // console.log('Applied Coupon data', this.appliedCouponData);   
          }
        },
        error: (error) => {
          console.log('Coupon data error', error.error);
          this.spinner.hide();
          this.toaster.error(error.error.message);
          this.appliedCouponData={
            isCouponApplied: false,
          }
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }

  useCoupon() {
    this.spinner.show();

    this.couponService
      .useCoupon(this.rideDetails.couponCode)
      .subscribe({
        next: (result: any) => {
          if (result.statusCode == 200) {
            this.spinner.hide();
            console.log('Use Coupon data', result);
          }
        },
        error: (error) => {
          console.log('use Coupon data error', error.error);
          this.spinner.hide();
          this.toaster.error(error.error.message);
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }

  //reset modal data
  resetValue(){
    this.rideDetails.couponCode = '';
    this.rideDetails.isCouponWanted = false;
    this.appliedCouponData = {
      isCouponApplied: false,
    }
  }

  //apply coupon discount
  getDiscountAmount() {
    if (this.appliedCouponData.discountType == 'percentage') {
      return (
        this.selectedVehicle?.fare - (this.selectedVehicle?.fare * this.appliedCouponData.discount / 100)
      );
    } else if(this.appliedCouponData.discountType == 'amount') {
      return (
        this.selectedVehicle?.fare - this.appliedCouponData.discount
      );
    } else {
      return this.selectedVehicle?.fare;
    }
  }
  
  generateTrip() {
    console.log('Ride Details', this.rideDetails);
    // this.createRide();

    if(this.appliedCouponData.isCouponApplied){
      this.createRide(this.appliedCouponData.couponCode, this.getDiscountAmount());
    } else{
      this.createRide('', '');
    }
  }

  newCreatedRide: any;
  createRide(couponCode: any, discount: any) {
    this.spinner.show();

    this.rideService
      .createRide({
        pickup: this.rideDetails.pickup,
        destination: this.rideDetails.drop,
        vehicleType: this.rideDetails.vehicleType,
        paymentMethod: this.rideDetails.paymentMethod,
        couponCode: couponCode,
        totalDiscountedFare: discount,
      })
      .subscribe({
        next: (result: any) => {
          if (result.statusCode == 201) {
            this.spinner.hide();
            console.log('Ride created', result);
            this.newCreatedRide = result.ride;

            if (this.newCreatedRide.couponDetails.couponApplied === 1){
              this.useCoupon();
            }

            if (this.newCreatedRide.paymentDetails.paymentMethod == 'online') {
              if (this.newCreatedRide.couponDetails.couponApplied === 1){
                this.paymentInit(this.newCreatedRide.couponDetails.totalDiscountedFare.toFixed(2));
              } else {
                this.paymentInit(this.newCreatedRide.fare);  
              }           
            } else if (
              this.newCreatedRide.paymentDetails.paymentMethod == 'wallet'
            ) {
              this.debitFromCaptainWallet(this.newCreatedRide._id);
            } else {
              this.sendNotification(this.newCreatedRide._id);
            }
          }
        },
        error: (error) => {
          console.log('Ride created error', error.error);

          if (error.error.statusCode == 400 || error.error.statusCode == 500) {
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

  debitFromCaptainWallet(rideId: any) {
    this.spinner.show();

    this.userWalletService.debitFromUserWallet({ rideId: rideId }).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Debit from user wallet data', result);

          this.upadatePaymentStatusAndId('wallet');
          this.sendNotification(this.newCreatedRide._id);
        }
      },
      error: (error) => {
        console.log('Debit from user wallet data error', error.error);

        if (
          error.error.statusCode == 400 ||
          error.error.statusCode == 500 ||
          error.error.statusCode == 404 ||
          error.error.statusCode == 401
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

  rideConfirmInterval: any;

  sendNotification(rideId: any) {
    this.rideService.sendNotificationToCaptain({ rideId: rideId }).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.rideGeneratePopup();
          console.log('Send notification data', result);

          this.rideConfirmInterval = setInterval(() => {
            this.confirmRide();
            console.log('confirm ride');
          }, 2000);
        }
      },
      error: (error) => {
        console.log('Send notification data error', error.error);

        if (error.error.statusCode == 400 || error.error.statusCode == 500) {
          this.toaster.error(error.error.message);
        } else {
          this.toaster.error('Something went wrong');
        }
      },
    });
  }

  options: any;

  paymentInit(amount: any) {
    this.spinner.show();
    this.paymentService
      .paymentInit({ amount: amount * 10 })
      .subscribe((order: any) => {
        this.options = {
          key: environment.RAZORPAY_KEY,
          amount: order.order.amount,
          currency: 'INR',
          name: 'Rider',
          description: 'Rider Payment',
          order_id: order.order.id,
          handler: (response: any) => {
            console.log('Payment Response:', response);
            // alert(
            //   'Payment successful! Payment ID: ' + response.razorpay_payment_id
            // );

            this.paymentVerification(response);
          },
          prefill: {
            name: `${this.userdetails.fullname.firstname} ${this.userdetails.fullname.lastname}`,
            email: this.userdetails.email,
            contact: '8568547585',
          },
          theme: {
            color: 'black',
          },
        };

        var rzp = new Razorpay(this.options);
        rzp.open();
      });
  }

  paymentVerification(response: any) {
    this.paymentService.paymentVerify(response).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          console.log('Payment verify data', result);
          this.sendNotification(this.newCreatedRide._id);
          this.upadatePaymentStatusAndId(response.razorpay_payment_id);
        }
      },
      error: (error) => {
        console.log('Payment verify data error', error.error);

        if (
          error.error.statusCode == 400 ||
          error.error.statusCode == 500 ||
          error.error.statusCode == 404
        ) {
          this.toaster.error(error.error.message);
        } else {
          this.toaster.error('Something went wrong');
        }
      },
    });
  }

  upadatePaymentStatusAndId(paymentId: any) {
    this.spinner.show();

    this.rideService
      .upadatePaymentStatusAndId({
        rideId: this.newCreatedRide._id,
        paymentId: paymentId,
      })
      .subscribe({
        next: (result: any) => {
          if (result.statusCode == 200) {
            this.spinner.hide();
            console.log('Updatepaymentstatus data', result);
          }
        },
        error: (error) => {
          console.log('Updatepaymentstatus data', error.error);

          if (error.error.statusCode == 400 || error.error.statusCode == 500) {
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

  confirmRide() {
    this.rideSocketService.confirmedRide().subscribe((ride) => {
      console.log('Ride Confirm Socket data', ride);
      Swal.close();
      this.rideAccepetedPopup();
      clearInterval(this.rideConfirmInterval);
      this.route.navigate([`/ride-ongoing/${ride._id}`]);
    });
  }

  userdetails: any = {};
  getUserDetails() {
    this.spinner.show();

    this.profileService.userProfile().subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Profile data', result);
          this.userSocketJoin(result.user._id, 'user');
          this.userdetails = result.user;
          // this.toaster.success(result.message);
        }
      },
      error: (error) => {
        console.log('Profile data error', error.error);

        if (error.error.statusCode == 404) {
          this.spinner.hide();
          console.log(error.error.message);
        } else {
          console.log('Something went wrong');
        }
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  userSocketJoin(userId: any, userType: any) {
    this.rideSocketService.joinRoom(userId, userType);
  }

  walletBalance: any;
  getUserWallet() {
    this.spinner.show();

    this.userWalletService.getUserWallet().subscribe({
      next: (result: any) => {
        if (result.statusCode === 200) {
          this.spinner.hide();
          console.log('wallet details', result.data);
          this.walletBalance = result.data.balance;
          // this.toaster.success(result.message);
        }
      },
      error: (error) => {
        console.log('wallet data error', error.error);

        if (
          error.error.statusCode == 404 ||
          error.error.statusCode == 500 ||
          error.error.statusCode == 401
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
