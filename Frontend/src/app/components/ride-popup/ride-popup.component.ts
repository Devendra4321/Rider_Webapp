import { Component } from '@angular/core';
import { RideSocketService } from '../../services/ride-socket/ride-socket.service';
import Swal from 'sweetalert2';
import { RideService } from '../../services/ride/ride.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ride-popup',
  templateUrl: './ride-popup.component.html',
  styleUrl: './ride-popup.component.css',
})
export class RidePopupComponent {
  constructor(
    private rideSocketService: RideSocketService,
    private rideService: RideService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private route: Router
  ) {}

  ngOnInit() {}

  isNewRide = false;

  getNewRideNotification() {
    this.rideNotification();
  }

  rideNotification() {
    console.log('Get new ride');

    this.rideSocketService.newRide().subscribe({
      next: (ride: any) => {
        console.log('New ride socket data:', ride);
        this.newRidePopup(ride);
      },
      error: (err) => console.error('Error receiving ride:', err),
    });
  }

  newRidePopup(ride: any) {
    let timerInterval: any;
    Swal.fire({
      title: 'Ride Request!',
      html: `
    <div>
      <p><b>Pickup:</b> ${ride.pickup}</p>
      <p><b>Drop:</b> ${ride.destination}</p>
      <p><b>Fare:</b> ${ride.captainFare}</p>
      <p><b>Time to accept ride: <span id="timer"></span> seconds</b></p>
    </div>
  `,
      icon: 'success',
      timer: 60000,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: 'black',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Accept',
      didOpen: () => {
        const timerElement = document.getElementById('timer');
        timerInterval = setInterval(() => {
          if (timerElement) {
            timerElement.textContent = `${Math.ceil(
              Swal.getTimerLeft()! / 1000
            )}`;
          }
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.acceptRide(ride._id);
      }
    });
  }

  acceptRide(rideId: any) {
    this.spinner.show();

    this.rideService.acceptRide({ rideId: rideId }).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Accept ride data', result);
          this.route.navigate([`/captain-ride-ongoing/${rideId}`]);
        }
      },
      error: (error) => {
        console.log('Accept ride data error', error.error);

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
}
