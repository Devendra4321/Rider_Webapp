import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ride-ongoing-info',
  templateUrl: './ride-ongoing-info.component.html',
  styleUrl: './ride-ongoing-info.component.css',
})
export class RideOngoingInfoComponent {
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
