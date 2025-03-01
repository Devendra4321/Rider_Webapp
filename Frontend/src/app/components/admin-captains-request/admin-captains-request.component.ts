import { Component } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-captains-request',
  standalone: false,
  templateUrl: './admin-captains-request.component.html',
  styleUrl: './admin-captains-request.component.css',
})
export class AdminCaptainsRequestComponent {
  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPendingCaptains();
  }

  pendingCaptains: any = [];
  inProgressCaptain: any = [];
  approvedCaptain: any = [];
  rejectedCaptain: any = [];
  captain: any = [];

  getPendingCaptains() {
    const data = {
      page: this.activePendingCaptaincurrentPage,
      perPage: this.activePendingCaptainTableSize,
      status: 0,
    };
    this.adminService.getCaptains(data).subscribe((result: any) => {
      if (result.statuscode === 200) {
        console.log('All pending captain', result);
        this.pendingCaptains = result.data;
        this.totalPendingCaptains = result.totalCaptains;
      } else {
        console.log('Failed to fetched pending captains data');
      }
    });
  }

  activePendingCaptaincurrentPage: number = 1;
  activePendingCaptainTableSize: number = 5;
  totalPendingCaptains: any = 0;

  onTablePendingCaptainDataChange(event: any) {
    this.activePendingCaptaincurrentPage = event;
    this.getPendingCaptains();
  }

  getInProgressCaptains() {
    const data = {
      page: this.activeInProgressCaptaincurrentPage,
      perPage: this.activeInProgressCaptainTableSize,
      status: 1,
    };
    this.adminService.getCaptains(data).subscribe((result: any) => {
      if (result.statuscode === 200) {
        console.log('All inprogress captain', result);
        this.inProgressCaptain = result.data;
        this.totalInProgressCaptains = result.totalCaptains;
      } else {
        console.log('Failed to fetched inprogress captains data');
      }
    });
  }

  activeInProgressCaptaincurrentPage: number = 1;
  activeInProgressCaptainTableSize: number = 5;
  totalInProgressCaptains: any = 0;

  onTableInProgressCaptainDataChange(event: any) {
    this.activeInProgressCaptaincurrentPage = event;
    this.getInProgressCaptains();
  }

  getApprovedCaptains() {
    const data = {
      page: this.activeApprovedCaptaincurrentPage,
      perPage: this.activeApprovedCaptainTableSize,
      status: 2,
    };
    this.adminService.getCaptains(data).subscribe((result: any) => {
      if (result.statuscode === 200) {
        console.log('All approved captain', result);
        this.approvedCaptain = result.data;
        this.totalApprovedCaptains = result.totalCaptains;
      } else {
        console.log('Failed to fetched approved captains data');
      }
    });
  }

  activeApprovedCaptaincurrentPage: number = 1;
  activeApprovedCaptainTableSize: number = 5;
  totalApprovedCaptains: any = 0;

  onTableApprovedCaptainDataChange(event: any) {
    this.activeApprovedCaptaincurrentPage = event;
    this.getInProgressCaptains();
  }

  getRejectedCaptains() {
    const data = {
      page: this.activeRejectedCaptaincurrentPage,
      perPage: this.activeRejectedCaptainTableSize,
      status: 3,
    };
    this.adminService.getCaptains(data).subscribe((result: any) => {
      if (result.statuscode === 200) {
        console.log('All rejected captain', result);
        this.rejectedCaptain = result.data;
        this.totalRejectedCaptains = result.totalCaptains;
      } else {
        console.log('Failed to fetched rejected captains data');
      }
    });
  }

  activeRejectedCaptaincurrentPage: number = 1;
  activeRejectedCaptainTableSize: number = 5;
  totalRejectedCaptains: any = 0;

  onTableRejectedCaptainDataChange(event: any) {
    this.activeApprovedCaptaincurrentPage = event;
    this.getInProgressCaptains();
  }

  fullName: any = {};
  vehicleData: any = {};

  getCaptainById(id: any) {
    this.adminService.getCaptainById(id).subscribe((result: any) => {
      if (result.statusCode == 200) {
        console.log('Captain fetched by id', result);
        this.captain = result.data;
        this.fullName = this.captain.fullname;
        this.vehicleData = this.captain.vehicle;
      } else {
        console.log('Failed to fetched the captain by id');
      }
    });
  }

  selectedFile: File | null = null;

  onUpload(event: Event, name: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('document', this.selectedFile);
        formData.append('documentName', name);
        formData.append('captainId', this.captain._id);

        this.adminService.uploadDocumnet(formData).subscribe((result: any) => {
          if (result.statusCode == 200) {
            console.log('Documnet uploaded', result);
            this.toastr.success(result.message);
          } else {
            console.log('Failed to upload documnet');
            this.toastr.error(result.message);
          }
        });
      }
    }
  }

  captainStatus = 'Choose...';

  updateCaptainStatus(status: any, id: string) {
    // console.log('Captain status:', status, id);
    status = parseInt(status);

    this.adminService
      .updateCaptainStatus({ status }, id)
      .subscribe((result: any) => {
        if (result.statuscode == 200) {
          console.log('Captain status updated', result);
          this.toastr.success(result.message);
          this.router.navigate(['/dashboard/captains-request']);
        } else {
          console.log('Failed to update captain status');
          this.toastr.error(result.message);
        }
      });
  }
}
