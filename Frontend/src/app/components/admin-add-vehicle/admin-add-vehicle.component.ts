import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-add-vehicle',
  standalone: false,
  templateUrl: './admin-add-vehicle.component.html',
  styleUrl: './admin-add-vehicle.component.css'
})
export class AdminAddVehicleComponent {

  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  vehicleDetails: any = {}; 

  addVehicle(from: NgForm){
    if(from.valid){
      // console.log(this.vehicleDetails);

      this.spinner.show();
      this.adminService.addVehicle(this.selectedFile, this.vehicleDetails).subscribe({
        next: (result: any) => {
          if(result.statusCode === 201){
            this.spinner.hide();
            this.toaster.success(result.message);
            console.log("add vehicle data", result);
          }
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toaster.error(error.error.message);
          console.log("add vehicle data error", error.error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  }

  selectedFile: any;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
