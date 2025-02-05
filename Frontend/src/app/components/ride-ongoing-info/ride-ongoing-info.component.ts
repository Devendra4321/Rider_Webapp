import { Component, Input, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { RideService } from '../../services/ride/ride.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { RideSocketService } from '../../services/ride-socket/ride-socket.service';

@Component({
  selector: 'app-ride-ongoing-info',
  templateUrl: './ride-ongoing-info.component.html',
  styleUrl: './ride-ongoing-info.component.css',
})
export class RideOngoingInfoComponent {
  constructor(
    private rideService: RideService,
    private rideSocketService: RideSocketService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private route: ActivatedRoute
  ) {}

  @ViewChild(MapComponent) mapComponent!: MapComponent;
  @Input() userType: String | undefined;
  rideId: any;
  rideStartedInterval: any;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.rideId = params.get('rideId')!;
      // console.log('Ride ID:', this.rideId);
    });

    this.getRideById(this.rideId);
    this.callRideStarted();
  }

  ngOnDestroy(): void {
    clearInterval(this.rideStartedInterval);
  }

  callRideStarted() {
    this.rideStartedInterval = setInterval(() => {
      this.rideStarted();
    }, 2000);
  }

  rideDetail: any = {};

  getRideById(rideId: any) {
    this.spinner.show();

    this.rideService.rideGetById(rideId).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          this.rideDetail = result.ride;
          console.log('Ride get by id data', result);
          setTimeout(() => this.drawRoute(), 2000);
        }
      },
      error: (error) => {
        console.log('Ride get by id data error', error.error);

        if (
          error.error.statusCode == 400 ||
          error.error.statusCode == 404 ||
          error.error.statusCode == 500
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

  drawRoute() {
    this.mapComponent.addRoute(
      [this.rideDetail.pickupLatLng.lng, this.rideDetail.pickupLatLng.ltd],
      [
        this.rideDetail.destinationLatLng.lng,
        this.rideDetail.destinationLatLng.ltd,
      ]
    );
  }

  async verifyOtp() {
    const { value: text, isConfirmed } = await Swal.fire({
      title: 'Enter Ride OTP',
      input: 'number',
      inputAttributes: {
        maxlength: '6',
      },
      confirmButtonText: 'Verify',
      confirmButtonColor: 'black',
      inputValidator: (value) => {
        if (!value || value.length !== 6) {
          return 'Enter a valid 6-digit OTP!';
        }
        return null;
      },
    });
    if (isConfirmed && text) {
      this.startRide(this.rideDetail._id, Number(text));
    }
  }

  startRide(rideId: any, otp: any) {
    this.spinner.show();

    this.rideService.startRide({ rideId: rideId, otp: otp }).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Ride started data', result);
        }
      },
      error: (error) => {
        console.log('Ride started data', error.error);

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

  rideStarted() {
    console.log('Ride Started socket');

    this.rideSocketService.startRide().subscribe((ride) => {
      this.rideDetail = ride;
      this.rideStartedPopup();
      clearInterval(this.rideStartedInterval);
    });

    if (this.rideDetail.status == 'ongoing') {
      clearInterval(this.rideStartedInterval);
    }
  }

  rideCompletedPopup() {
    Swal.fire({
      title: 'Ride Completed!',
      text: 'Ride completed. Thank you.. please book again!  Have a nice day. ',
      icon: 'success',
      confirmButtonText: 'ok',
      showCloseButton: true,
      customClass: {
        confirmButton: 'swal-confirm-btn',
      },
    });
  }

  rideStartedPopup() {
    Swal.fire({
      title: 'Ride Started by Captain!',
      text: 'Ride started by captain. Enjoy journey with ride app. ',
      icon: 'success',
      confirmButtonText: 'ok',
      showCloseButton: true,
      customClass: {
        confirmButton: 'swal-confirm-btn',
      },
    });
  }

  rideCancelledPopup() {
    Swal.fire({
      title: 'Do you want to cancel the ride?',
      confirmButtonText: 'Cancel ride',
      showCloseButton: true,
      customClass: {
        confirmButton: 'swal-confirm-btn',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Ride Cancelled by User!',
          text: 'Your ride money will be credited shortly within 2 to 3 working days.',
          icon: 'warning',
          customClass: {
            confirmButton: 'swal-confirm-btn',
          },
        });
      }
    });
  }
}
