import { Component } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environment/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ride-ongoing',
  templateUrl: './ride-ongoing.component.html',
  styleUrl: './ride-ongoing.component.css',
})
export class RideOngoingComponent {
  map!: mapboxgl.Map;

  ngAfterViewInit(): void {
    (mapboxgl as any).accessToken = environment.MAP_BOX_ACCESS_TOKEN;

    this.map = new mapboxgl.Map({
      container: 'map', // ID of the div where map will be rendered
      style: 'mapbox://styles/mapbox/streets-v11', // Map style
      center: [77.209, 28.6139], // Longitude, Latitude (Example: New Delhi, India)
      zoom: 12,
    });

    // Add zoom and rotation controls
    this.map.addControl(new mapboxgl.NavigationControl());
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
