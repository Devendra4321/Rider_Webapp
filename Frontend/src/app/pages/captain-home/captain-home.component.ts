import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ProfileService } from '../../services/profile/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RideSocketService } from '../../services/ride-socket/ride-socket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-captain-home',
  templateUrl: './captain-home.component.html',
  styleUrl: './captain-home.component.css',
})
export class CaptainHomeComponent {
  constructor(
    private profileService: ProfileService,
    private rideSocketService: RideSocketService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  isOnline: boolean = false;

  ngOnInit() {
    const savedState = localStorage.getItem('isOnline');
    if (savedState !== null) {
      this.isOnline = JSON.parse(savedState);
    }

    this.captainProfile();

    if (this.isOnline) {
      this.captainSocketJoin(this.captainDetail._id, 'captain');
      this.getCurrentLocation();
    }
  }

  toggleCaptainStatus() {
    this.isOnline = !this.isOnline;
    localStorage.setItem('isOnline', JSON.stringify(this.isOnline));

    if (this.isOnline) {
      this.captainSocketJoin(this.captainDetail._id, 'captain');
      this.getCurrentLocation();
      Swal.fire({
        title: 'Good job!',
        text: 'You are now Online',
        icon: 'success',
        confirmButtonText: 'ok',
        showCloseButton: true,
        customClass: {
          confirmButton: 'swal-confirm-btn',
        },
      });
    } else {
      this.offlineCaptain();
      clearInterval(this.intervalId);
      Swal.fire({
        title: 'Ooops!',
        text: 'You are now Offline',
        icon: 'error',
        confirmButtonText: 'ok',
        showCloseButton: true,
        customClass: {
          confirmButton: 'swal-confirm-btn',
        },
      });
    }
  }

  captainDetail: any = {};
  documentsAvailable: any;

  captainProfile() {
    this.spinner.show();

    this.profileService.captainProfile().subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Profile data', result);
          this.captainDetail = result.captain;
          this.documentsAvailable = {
            aadharfront:
              typeof this.captainDetail.documents.aadharfront !== 'undefined',
            aadharback:
              typeof this.captainDetail.documents.aadharback !== 'undefined',
            drivinglicense:
              typeof this.captainDetail.documents.drivinglicense !==
              'undefined',
            rc: typeof this.captainDetail.documents.rc !== 'undefined',
          };

          // this.toaster.success(result.message);
        }
      },
      error: (error) => {
        console.log('Profile data error', error.error);

        if (error.error.statusCode == 404) {
          this.spinner.hide();
          console.timeLog(error.error.message);
        } else {
          console.log('Something went wrong');
        }
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  captainSocketJoin(captainId: any, userType: any) {
    this.rideSocketService.joinRoom(captainId, userType);
    console.log('Captain is now online');
  }

  offlineCaptain() {
    this.rideSocketService.offlineCaptain();
    console.log('Captain is now offline');
  }

  currentCaptainLoc = {};
  intervalId: any;
  getCurrentLocation() {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          this.intervalId = setInterval(() => {
            this.setCaptainCurrentLocation(latitude, longitude);
          }, 2000);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.toaster.error('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              this.toaster.error('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              this.toaster.error('The request to get user location timed out.');
              break;
            default:
              this.toaster.error('An unknown error occurred.');
              break;
          }
        },
        options
      );
    } else {
      this.toaster.error('Geolocation is not supported by this browser.');
    }
  }

  setCaptainCurrentLocation(latitude: any, longitude: any) {
    const userId = this.captainDetail._id;
    const location = { ltd: latitude, lng: longitude };
    this.rideSocketService.setCaptainCurrentLocation(userId, location);
    console.log('Captain current location set');
  }
}
