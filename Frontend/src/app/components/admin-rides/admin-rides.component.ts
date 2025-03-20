import { Component } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-rides',
  standalone: false,
  templateUrl: './admin-rides.component.html',
  styleUrl: './admin-rides.component.css',
})
export class AdminRidesComponent {
  constructor(
    private adminService: AdminService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
  ) {}

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


  viewRide: any;

  getRideById(id: any) {
    this.spinner.show();
    
    this.adminService.getRideById(id).subscribe({
      next: (result: any) => {
        if(result.statusCode == 200){
          this.spinner.hide();
          this.viewRide = result.ride;
          console.log('Ride get by id data', result);
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log('Ride get by id data error', error.error);
        this.toaster.error(error.error.message);
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }
}
