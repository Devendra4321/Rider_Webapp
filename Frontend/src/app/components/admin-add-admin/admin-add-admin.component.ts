import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-add-admin',
  standalone: false,
  templateUrl: './admin-add-admin.component.html',
  styleUrl: './admin-add-admin.component.css'
})
export class AdminAddAdminComponent {
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  newAdmin = {
    email: '',
    password: '',
    type: 'admin'
  };

  addAdmin(form: NgForm) {
    if (form.valid) {
      // console.log("Admin form data",this.newAdmin);

      this.spinner.show();

      this.adminService.addNewAdmin(this.newAdmin).subscribe({
        next: (response: any) => {
          if (response.statuscode === 201) {
            this.spinner.hide();
            console.log("Admin added", response);   
            this.toastr.success(response.message);
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log("Admin added error", error.error);
          this.toastr.error(error.error.message);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  }

}
