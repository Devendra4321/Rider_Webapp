import { Component, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MapComponent } from '../../components/map/map.component';
import { RideService } from '../../services/ride/ride.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-ride-review',
  templateUrl: './ride-review.component.html',
  styleUrl: './ride-review.component.css',
})
export class RideReviewComponent {
  constructor(
    private rideService: RideService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {}

  @ViewChild(MapComponent) childComponent!: MapComponent;

  locationDetails: any = {};
  ngAfterViewInit() {
    this.getLocationDetails();
  }

  rideDetails = {
    pickup: '',
    drop: '',
    vehicleType: '',
    paymentMethod: 'cash',
  };

  getLocationDetails() {
    if (history.state) {
      this.locationDetails = history.state.location;
      this.rideDetails.pickup = this.locationDetails.pickupLoc;
      this.rideDetails.drop = this.locationDetails.dropLoc;
      console.log('Location details:', this.locationDetails);
    }

    this.getRoute();
    this.getVehiclePrices();
  }

  getRoute() {
    setTimeout(() => {
      if (this.locationDetails) {
        this.childComponent.getPickupCordinates(this.locationDetails.pickupLoc);
        this.childComponent.getDropCordinates(this.locationDetails.dropLoc);
      }
    }, 800);
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

  vehiclePrices: any = {};

  getVehiclePrices() {
    this.spinner.show();

    this.rideService
      .getVehiclePrices({
        pickup: this.locationDetails.pickupLoc,
        destination: this.locationDetails.dropLoc,
      })
      .subscribe({
        next: (result: any) => {
          if (result.statusCode == 200) {
            this.spinner.hide();
            this.vehiclePrices = result.data;
            console.log('Vehicle data', result);
          }
        },
        error: (error) => {
          console.log('Vehicle data error', error.error);

          if (error.error.statusCode == 400 || error.error.statusCode == 500) {
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

  isMotercyclevehicleTypeClicked = false;
  isAutovehicleTypeClicked = false;
  isCarvehicleTypeClicked = false;
  isTaxivehicleTypeClicked = false;

  getVehicleDetails(vehicleType: any, isclicked: boolean) {
    this.rideDetails.vehicleType = vehicleType;

    if (vehicleType == 'motorcycle') {
      this.isMotercyclevehicleTypeClicked = isclicked;
    } else {
      this.isMotercyclevehicleTypeClicked = false;
    }

    if (vehicleType == 'auto') {
      this.isAutovehicleTypeClicked = isclicked;
    } else {
      this.isAutovehicleTypeClicked = false;
    }

    if (vehicleType == 'car') {
      this.isCarvehicleTypeClicked = isclicked;
    } else {
      this.isCarvehicleTypeClicked = false;
    }

    if (vehicleType == 'taxi') {
      this.isTaxivehicleTypeClicked = isclicked;
    } else {
      this.isTaxivehicleTypeClicked = false;
    }

    // console.log(this.rideDetails);
  }

  generateTrip() {
    console.log('Ride Details', this.rideDetails);
    this.rideGeneratePopup();
  }
}
