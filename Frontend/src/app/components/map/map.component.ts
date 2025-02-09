import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import mapboxgl, { LngLatBoundsLike, LngLatLike } from 'mapbox-gl';
import { environment } from '../../../environment/environment';
import { MapService } from '../../services/map/map.service';
import mapboxSdk from '@mapbox/mapbox-sdk/services/geocoding';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  constructor(private mapService: MapService) {}

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  @Input() width: string | undefined;
  @Input() height: string | undefined;

  map: mapboxgl.Map | undefined;
  marker: mapboxgl.Marker | undefined;

  private accessToken: string = environment.MAP_BOX_ACCESS_TOKEN;
  private geocodingClient = mapboxSdk({ accessToken: this.accessToken });

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  initMap() {
    (mapboxgl as any).accessToken = environment.MAP_BOX_ACCESS_TOKEN;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [77.209, 28.6139],
      zoom: 13,
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    // this.map.addControl(
    //   new mapboxgl.GeolocateControl({
    //     positionOptions: { enableHighAccuracy: true },
    //     trackUserLocation: true,
    //     showUserHeading: true,
    //   })
    // );

    this.map.addControl(new mapboxgl.FullscreenControl());

    this.map.on('load', () => {
      console.log('Map is fully loaded and ready for markers');
    });
  }

  loadMap(place: any): void {
    this.geocodingClient
      .forwardGeocode({
        query: place,
        autocomplete: false,
        limit: 1,
      })
      .send()
      .then((response: any) => {
        if (!response.body.features.length) {
          console.error('No location found for:', place);
          return;
        }

        const feature = response.body.features[0];

        if (!this.map) {
          this.map = new mapboxgl.Map({
            container: this.mapContainer.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: feature.center,
            zoom: 13,
          });
        } else {
          this.map.flyTo({ center: feature.center, zoom: 13 });
        }

        document
          .querySelectorAll('.mapboxgl-marker')
          .forEach((marker) => marker.remove());

        const popup = new mapboxgl.Popup().setHTML(`<div style="
      font-family: Arial, sans-serif; 
      padding: 10px; 
      text-align: center; 
      color: #333;
    ">
      <h3 style="margin: 0; font-size: 16px; color: #007bff;">Pickup Location</h3>
      <p style="margin: 5px 0; font-size: 14px;">Your pickup is set here.</p>
      
    </div>`);

        new mapboxgl.Marker({ color: 'orange' })
          .setLngLat(feature.center)
          .setPopup(popup)
          .addTo(this.map);
      })
      .catch((err: any) => console.error('Geocoding error:', err));
  }

  endMarker: mapboxgl.Marker | null = null;
  startMarker: mapboxgl.Marker | null = null;

  addRoute(start: [number, number], end: [number, number]) {
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${environment.MAP_BOX_ACCESS_TOKEN}`;

    fetch(directionsUrl)
      .then((response) => response.json())
      .then((data) => {
        const route = data.routes[0]?.geometry?.coordinates;

        if (!route || route.length === 0) {
          console.error('No route found');
          return;
        }

        if (this.map?.getSource('route')) {
          this.map.removeLayer('route');
          this.map.removeSource('route');
        }

        this.map?.addSource('route', {
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

        this.map?.addLayer({
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

        const bounds = new mapboxgl.LngLatBounds();
        route.forEach((coord: LngLatBoundsLike | LngLatLike) =>
          bounds.extend(coord)
        );
        bounds.extend(start);
        bounds.extend(end);

        this.map?.fitBounds(bounds, { padding: 50 });

        if (this.endMarker) {
          this.endMarker.remove();
        }

        if (this.startMarker) {
          this.startMarker.remove();
        }

        const popupEnd = new mapboxgl.Popup().setHTML(`<div style="
          font-family: Arial, sans-serif; 
          padding: 10px; 
          text-align: center; 
          color: #333;
        ">
          <h3 style="margin: 0; font-size: 16px; color: #007bff;">Drop Location</h3>
          <p style="margin: 5px 0; font-size: 14px;">Your drop is set here.</p>
          
        </div>`);

        const popupStart = new mapboxgl.Popup().setHTML(`<div style="
          font-family: Arial, sans-serif; 
          padding: 10px; 
          text-align: center; 
          color: #333;
        ">
          <h3 style="margin: 0; font-size: 16px; color: #007bff;">Pickup Location</h3>
          <p style="margin: 5px 0; font-size: 14px;">Your pickup is set here.</p>
          
        </div>`);

        this.endMarker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat(end)
          .setPopup(popupEnd)
          .addTo(this.map!);

        this.startMarker = new mapboxgl.Marker({ color: 'orange' })
          .setLngLat(start)
          .setPopup(popupStart)
          .addTo(this.map!);
      })
      .catch((error) => {
        console.error('Error fetching the route:', error);
      });
  }

  location = {
    pickupLoc: '',
    dropLoc: '',
  };

  getMarker(location: any) {
    if (!this.map) {
      console.error('Map is not initialized yet!');
      return;
    }

    console.log('Received pickup location:', location);
    this.location.pickupLoc = location;
    this.loadMap(location);
    this.getPickupCordinates(location);
  }

  getDropLoc(location: any) {
    console.log('Received drop location:', location);
    this.location.dropLoc = location;
    this.getDropCordinates(this.location.dropLoc);
  }

  getRoute() {
    if (this.pickupCoordinateData && this.dropCoordinateData) {
      this.addRoute(
        [
          this.pickupCoordinateData.longitude,
          this.pickupCoordinateData.latitude,
        ],
        [this.dropCoordinateData.longitude, this.dropCoordinateData.latitude]
      );
    }
  }

  pickupCoordinateData: any;
  dropCoordinateData: any;

  getPickupCordinates(location: any) {
    this.mapService.getCordinates(location).subscribe({
      next: (result: any) => {
        if (result.statusCode === 200) {
          console.log('Pickup Coordinates data:', result);
          this.pickupCoordinateData = result.data;
          this.getRoute();
        }
      },
      error: (error) => {
        console.log('Coordinates data error:', error.error);
        if (error.error.statusCode === 500) {
          console.log(error.error);
        } else {
          console.log('Something went wrong');
        }
      },
    });
  }

  getDropCordinates(location: any) {
    this.mapService.getCordinates(location).subscribe({
      next: (result: any) => {
        if (result.statusCode === 200) {
          console.log('Drop Coordinates data:', result);
          this.dropCoordinateData = result.data;
          this.getRoute();
          // const mapComponent = new MapComponent(this.mapService);
          // mapComponent.getRoute();
        }
      },
      error: (error) => {
        console.log('Coordinates data error:', error.error);
        if (error.error.statusCode === 500) {
          console.log(error.error);
        } else {
          console.log('Something went wrong');
        }
      },
    });
  }
}
