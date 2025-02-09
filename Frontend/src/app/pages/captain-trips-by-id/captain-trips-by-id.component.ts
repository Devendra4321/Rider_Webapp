import { Component, ViewChild } from '@angular/core';
import { RideService } from '../../services/ride/ride.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { MapComponent } from '../../components/map/map.component';

@Component({
    selector: 'app-captain-trips-by-id',
    templateUrl: './captain-trips-by-id.component.html',
    styleUrl: './captain-trips-by-id.component.css',
    standalone: false
})
export class CaptainTripsByIdComponent {
  constructor(
    private rideService: RideService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private route: ActivatedRoute
  ) {}

  @ViewChild(MapComponent) mapComponent!: MapComponent;

  rideId: any;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.rideId = params.get('rideId')!;
      // console.log('Ride ID:', this.rideId);
    });

    this.getRideById(this.rideId);
  }

  rideDetail: any = {};

  getRideById(rideId: any) {
    this.spinner.show();

    this.rideService.rideGetById(rideId).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          this.rideDetail = result.ride;
          console.log('Ride get by id data', result);
          setTimeout(
            () =>
              this.drawRoute(
                result.ride.pickupLatLng,
                result.ride.destinationLatLng
              ),
            2000
          );
        }
      },
      error: (error) => {
        console.log('Ride get by id data error', error.error);

        if (
          error.error.statusCode == 400 ||
          error.error.statusCode == 404 ||
          error.error.statusCode == 500
        ) {
          this.spinner.hide();
          this.toaster.error(error.error.message);
        } else {
          this.toaster.error('Something went wrong');
        }
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  drawRoute(pickup: any, drop: any) {
    // console.log(pickup, drop);
    this.mapComponent.addRoute(
      [pickup?.lng, pickup?.ltd],
      [drop?.lng, drop?.ltd]
    );
  }
}
