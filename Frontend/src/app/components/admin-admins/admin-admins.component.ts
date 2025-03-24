import { Component } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-admins',
  standalone: false,
  templateUrl: './admin-admins.component.html',
  styleUrl: './admin-admins.component.css'
})
export class AdminAdminsComponent {
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
  ) {}

  ngOnInit() {
    this.getActiveAdmins();
  }

  activeAdmins: any = [];
  deletedAdmins: any= [];

  getActiveAdmins(){
    this.spinner.show();

    this.adminService.getAllAdmins({ page: this.activeAdminscurrentPage, perPage: this.activeAdminsTableSize, isDeleted: false,}).subscribe({
      next: (result: any) => {
        if(result.statuscode === 200){
          this.spinner.hide();
          console.log("Active admins data", result);
          this.activeAdmins = result.data;
          this.totalActiveAdmins = result.totalAdmins;
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log("Active admins data error", error.error);
        this.toaster.error(error.error.message);
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  getDeletedAdmins(){
    this.spinner.show();

    this.adminService.getAllAdmins({ page: this.deletedAdminscurrentPage, perPage: this.deletedAdminsTableSize, isDeleted: true }).subscribe({
      next: (result: any) => {
        if(result.statuscode === 200){
          this.spinner.hide();
          console.log("Deleted admins data", result);
          this.deletedAdmins = result.data;
          this.totalDeletedAdmins = result.totalAdmins;
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log("Deleted admins data error", error.error);
        this.toaster.error(error.error.message);
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  activeAdminscurrentPage: number = 1;
  activeAdminsTableSize: number = 5;
  totalActiveAdmins: any = 0;

  onTableActiveAdminDataChange(event: any) {
    this.activeAdminscurrentPage = event;
    this.getActiveAdmins();
  }

  deletedAdminscurrentPage: number = 1;
  deletedAdminsTableSize: number = 5;
  totalDeletedAdmins: any = 0;

  onTableDeletedAdminDataChange(event: any) {
    this.deletedAdminscurrentPage = event;
    this.getDeletedAdmins();
  }

  adminDetails: any = {};

  getAdminById(adminId: any){
    this.spinner.show();

    this.adminService.getAdminById(adminId).subscribe({
      next: (result: any) => {
        if(result.statusCode === 200){
          this.spinner.hide();
          console.log("Admin data by id", result);
          this.adminDetails = result.admin;
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log("Admin data by id error", error.error);
        this.toaster.error(error.error.message);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  updateAdminFormData(form: any){
    if(form.valid){
      // console.log("Admin update form data", this.adminDetails);
      this.updateAdmin()
    }
  }

  updateAdmin(){
    this.spinner.show();

      this.adminService.updateAdmin(this.adminDetails._id, this.adminDetails).subscribe({
        next: (result: any) => {
          if(result.statusCode === 200){
            this.spinner.hide();
            console.log("Update admin data", result);
            this.toaster.success(result.message);
            if(this.adminDetails.isDeleted == "false"){
              this.getDeletedAdmins();
            } else{
              this.getActiveAdmins();
            }
          }
        },
        error: (error: any) => {
          this.spinner.hide();
          console.log("Update admin data error", error.error);
          this.toaster.error(error.error.message);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
  }
}
