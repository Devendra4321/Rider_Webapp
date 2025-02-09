import { Component, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environment/environment';
import { MapService } from '../../services/map/map.service';
import { NgForm } from '@angular/forms';
import { MapComponent } from '../../components/map/map.component';
import { Router } from '@angular/router';
import { RideSocketService } from '../../services/ride-socket/ride-socket.service';
import { ProfileService } from '../../services/profile/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-user-home',
    templateUrl: './user-home.component.html',
    styleUrl: './user-home.component.css',
    standalone: false
})
export class UserHomeComponent {
  constructor(
    private mapService: MapService,
    private rideSocketService: RideSocketService,
    private profileService: ProfileService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {}

  @ViewChild(MapComponent) childComponent!: MapComponent;

  location = {
    pickupLoc: '',
    dropLoc: '',
  };

  userId = {};
  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    this.spinner.show();

    this.profileService.userProfile().subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Profile data', result);
          this.userId = result.user._id;
          this.userSocketJoin(this.userId, 'user');
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
