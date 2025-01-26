import { Component } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-trips-by-id',
  templateUrl: './trips-by-id.component.html',
  styleUrl: './trips-by-id.component.css',
})
export class TripsByIdComponent {
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
}
