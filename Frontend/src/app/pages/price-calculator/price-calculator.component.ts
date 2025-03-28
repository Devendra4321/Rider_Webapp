import { Component } from '@angular/core';
import { RideService } from '../../services/ride/ride.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-price-calculator',
  standalone: false,
  templateUrl: './price-calculator.component.html',
  styleUrl: './price-calculator.component.css'
})
export class PriceCalculatorComponent {

  constructor(
    private rideService: RideService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService) { }

  isVehiclePriceGet = false;
  locationDetails: any = {
    pickupLoc: '',
    dropLoc: '',
  };

  vehiclePrices: any;

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
            this.isVehiclePriceGet = true;
            console.log('Vehicle data', result);
          }
        },
        error: (error) => {
          console.log('Vehicle data error', error.error);

          if (error.error.statusCode == 400 || error.error.statusCode == 500) {
            this.spinner.hide();
            this.toaster.error(error.error.message);
            console.log(error.error.message);
          } else {
            this.toaster.error('Something went wrong');
            console.log('Something went wrong');
          }
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }

  calculatePrice(form: any) {
    if (form.valid) {
      // console.log('Location details', this.locationDetails);

      this.getVehiclePrices();
    }
  }

}
