import { Component } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-admin-rides',
  standalone: false,
  templateUrl: './admin-rides.component.html',
  styleUrl: './admin-rides.component.css',
})
export class AdminRidesComponent {
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.getAllRides();
  }

  rides: any = [];

  getAllRides() {
    const data = {
      page: this.activeRidescurrentPage,
      perPage: this.activeRidesTableSize,
    };
    this.adminService.getRides(data).subscribe((result: any) => {
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
