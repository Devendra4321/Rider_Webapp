import { Component } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import Swal from 'sweetalert2';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-ride-review',
  templateUrl: './ride-review.component.html',
  styleUrl: './ride-review.component.css',
})
export class RideReviewComponent {
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

  rideGeneratePopup() {
    Swal.fire({
      title: 'Ride Generated Successfully!',
      text: 'Please wait for the captain to accept the ride. You will be notified when the ride is accepted by the captain.',
      icon: 'success',
      confirmButtonText: 'OK',
      showCloseButton: true,
      customClass: {
        confirmButton: 'swal-confirm-btn',
      },
    });
  }

  rideAccepetedPopup() {
    Swal.fire({
      title: 'Ride Accepted by Captain!',
      text: 'Your ride has been accepted by the captain. You will be notified when the captain arrives at your location.',
      icon: 'success',
      confirmButtonText: 'View Details',
      showCloseButton: true,
      customClass: {
        confirmButton: 'swal-confirm-btn',
      },
    });
  }
}
