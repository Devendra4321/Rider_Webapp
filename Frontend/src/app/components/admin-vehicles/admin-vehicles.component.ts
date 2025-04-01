import { Component } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-vehicles',
  standalone: false,
  templateUrl: './admin-vehicles.component.html',
  styleUrl: './admin-vehicles.component.css'
})
export class AdminVehiclesComponent {
  coupons: any;

  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllVehicles();
  }

  vehicles: any;

  getAllVehicles(){
    this.spinner.show();

    this.adminService.getAllVehicles().subscribe({
      next: (result: any) => {
        if(result.statusCode === 200){
          this.spinner.hide();
          console.log("Vehicle data", result);
          this.vehicles = result.vehicles;          
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log("Vehicle data", error.error);
        this.toaster.error(error.error.message);
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  couponDetails = {
    code: '',
    discount: '',
    usageLimit: '',
    expirationDate: '',
    type: '',
    isActive: false
  };

  vehicleDetails: any = {};
  
  getVehicleById(vehicleId: any){
    this.spinner.show();

    this.adminService.getVehicleById(vehicleId).subscribe({
      next: (result: any) => {
        if(result.statusCode === 200){
          this.spinner.hide();
          console.log("Vehicle get by id data", result);
          this.vehicleDetails = result.vehicle;        
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toaster.error(error.error.message);
        console.log("Vehicle get by id data error", error.error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  updateVehicle(form: NgForm){
    if(form.valid){
      this.updateVehicleData(this.vehicleDetails._id);
    }
  }

  updateVehicleData(vehicleId: any){
    this.spinner.show();

    this.adminService.updateVehicle(vehicleId, this.vehicleDetails).subscribe({
      next: (result: any) => {
        if(result.statusCode === 200){
          this.spinner.hide();
          this.toaster.success(result.message);
          console.log("Vehicle update data", result);
          this.getAllVehicles();
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toaster.error(error.error.message);
        console.log("Vehicle update data error", error.error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }
}
