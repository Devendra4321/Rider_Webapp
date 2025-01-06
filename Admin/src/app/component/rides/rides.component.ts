import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RideService } from '../../services/rides/ride.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-rides',
  imports: [CommonModule, HttpClientModule, NgbPaginationModule],
  templateUrl: './rides.component.html',
  styleUrl: './rides.component.scss',
  providers: [RideService],
})
export class RidesComponent {
  constructor(private rideService: RideService) {}

  ngOnInit() {
    this.getAllRides();
  }

  rides: any = [];

  getAllRides() {
    const data = {
      page: this.activeRidescurrentPage,
      perPage: this.activeRidesTableSize,
    };
    this.rideService.getRides(data).subscribe((result: any) => {
      if (result.statuscode === 200) {
        console.log('All rides', result);
        this.rides = result.data;
        console.log('rides', this.rides);

        this.totalActiveRides = result.totalRides;
      } else {
        console.log('Failed to fetched data');
      }
    });
  }

  activeRidescurrentPage: number = 1;
  activeRidesTableSize: number = 5;
  totalActiveRides: any = 0;

  onTableActiveRideDataChange(event: any) {
    this.activeRidescurrentPage = event;
    this.getAllRides();
  }
}
