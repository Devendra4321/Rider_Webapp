import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TrackOrderService } from '../../services/trackorder/track-order.service';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-trackorder',
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './trackorder.component.html',
  styleUrls: ['./trackorder.component.scss'],
  providers: [TrackOrderService],
})
export class TrackorderComponent {
  constructor(
    private route: ActivatedRoute,
    private trackOrderService: TrackOrderService
  ) {}

  id: any;

  map: mapboxgl.Map | any;
  style = 'mapbox://styles/mapbox/streets-v11';
  pickLat: any;
  pickLng: any;
  dropLat: any;
  dropLng: any;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getRide();

    setTimeout(() => this.initMap(), 1000);
  }

  initMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapboxToken,
      container: 'map',
      style: this.style,
      zoom: 14,
      center: [this.pickLng, this.pickLat],
    });

    new mapboxgl.Marker({ color: 'orange' })
      .setLngLat([this.pickLng, this.pickLat])
      .addTo(this.map);

    new mapboxgl.Marker({ color: 'red' })
      .setLngLat([this.dropLng, this.dropLat])
      .addTo(this.map);

    this.map.on('load', () => {
      this.getRoute([this.pickLng, this.pickLat], [this.dropLng, this.dropLat]);
    });
  }

  // Function to fetch and display the route
  getRoute(start: [number, number], end: [number, number]) {
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${environment.mapboxToken}`;

    fetch(directionsUrl)
      .then((response) => response.json())
      .then((data) => {
        const route = data.routes[0].geometry.coordinates;

        // Add a GeoJSON source for the route
        this.map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route,
            },
          },
        });

        // Add a line layer to display the route
        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': 'blue',
            'line-width': 5,
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching the route:', error);
      });
  }

  ride: any = [];

  getRide() {
    this.trackOrderService.getRide(this.id).subscribe((result: any) => {
      if (result.statusCode === 200) {
        console.log('ride', result);
        this.ride = result.ride;
        this.pickLat = this.ride.pickupLatLng.ltd;
        this.pickLng = this.ride.pickupLatLng.lng;
        this.dropLat = this.ride.destinationLatLng.ltd;
        this.dropLng = this.ride.destinationLatLng.lng;
      } else {
        console.log('Failed to feteched ride');
      }
    });
  }
}
