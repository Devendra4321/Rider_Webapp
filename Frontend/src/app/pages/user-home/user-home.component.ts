import { Component, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environment/environment';
import { MapService } from '../../services/map/map.service';
import { NgForm } from '@angular/forms';
import { MapComponent } from '../../components/map/map.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css',
})
export class UserHomeComponent {
  constructor(private mapService: MapService, private route: Router) {}

  @ViewChild(MapComponent) childComponent!: MapComponent;

  location = {
    pickupLoc: '',
    dropLoc: '',
  };

  suggestions = [];
  isSuggestionsPresent = true;
  debounceTimer: any;

  selectPickupLocation(location: string) {
    this.location.pickupLoc = location;
    this.childComponent.getMarker(this.location.pickupLoc);
  }

  selectDropLocation(location: string) {
    this.location.dropLoc = location;
    this.childComponent.getDropLoc(this.location.dropLoc);
  }

  getPickupSuggestion() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.allSuggestions(this.location.pickupLoc);
      this.childComponent.getMarker(this.location.pickupLoc);
    }, 800);
  }

  getDropSuggestion() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.allSuggestions(this.location.dropLoc);
      this.childComponent.getDropLoc(this.location.dropLoc); // Call child's function automatically
    }, 800);
  }

  allSuggestions(location: any) {
    this.mapService.getSuggestion(location).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          console.log('Suggestion data:', result);
          this.suggestions = result.suggestions.map(
            (location: any) => location.name
          );
          // console.log(this.suggestions);
          this.isSuggestionsPresent = false;
        }
      },
      error: (error) => {
        console.log('Suggestion data error:', error.error);
        if (error.error.statusCode == 500) {
          console.log(error.error);
        } else {
          console.log('Something went wrong');
        }
      },
    });
  }

  locationForm(form: NgForm) {
    if (form.valid) {
      this.route.navigate(['/ride-review'], {
        state: { location: this.location },
      });
    }
  }
}
