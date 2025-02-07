import { Component } from '@angular/core';
import { GetRideAllService } from '../../services/get-ride-all/get-ride-all.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-captain-trips',
  templateUrl: './captain-trips.component.html',
  styleUrl: './captain-trips.component.css',
})
export class CaptainTripsComponent {
  constructor(
    private getAllRideService: GetRideAllService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllRides();
    this.getAllRidesByStatus();
  }

  allRides: any = [];
  allRidesByStatus: any = [];
  totalRidesBystatus: any;
  totalRides = 0;
  currentPage = 1;
  perPage = 4;

  getAllRides() {
    this.spinner.show();

    this.getAllRideService
      .getAllCaptainRides({ page: this.currentPage, perPage: this.perPage })
      .subscribe({
        next: (result: any) => {
          if (result.statusCode == 200) {
            this.spinner.hide();
            console.log('Get all rides data', result);
            this.allRides = result.rides;
            this.totalRides = result.totalRides;
          }
        },
        error: (error) => {
          console.log('Get all rides data error', error.error);

          if (error.error.statusCode == 500) {
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

  onPageChange(event: any): void {
    this.currentPage = event;
    this.getAllRides();
  }

  getAllRidesByStatus() {
    this.spinner.show();

    this.getAllRideService
      .getAllCaptainRides({ page: 1, perPage: 15 })
      .subscribe({
        next: (result: any) => {
          if (result.statusCode == 200) {
            this.spinner.hide();
            // console.log('Get all rides data', result);

            this.allRidesByStatus = result.rides.filter(
              (ride: any) =>
                ride.status == 'accepted' ||
                ride.status == 'ongoing' ||
                ride.status == 'started'
            );

            this.totalRidesBystatus = this.allRidesByStatus?.length;

            console.log('All ride by status:', this.allRidesByStatus);
          }
        },
        error: (error) => {
          console.log('Get all rides data error', error.error);

          if (error.error.statusCode == 500) {
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
}
