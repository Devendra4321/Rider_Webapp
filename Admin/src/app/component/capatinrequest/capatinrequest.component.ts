import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CaptainRequestService } from '../../services/captainrequest/captain-request.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-capatinrequest',
  imports: [CommonModule, HttpClientModule, NgbPaginationModule, FormsModule],
  templateUrl: './capatinrequest.component.html',
  styleUrl: './capatinrequest.component.scss',
  providers: [CaptainRequestService],
})
export class CapatinrequestComponent {
  constructor(private captainRequestService: CaptainRequestService) {}

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
    this.captainRequestService.getCaptains(data).subscribe((result: any) => {
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
    this.captainRequestService.getCaptains(data).subscribe((result: any) => {
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
    this.captainRequestService.getCaptains(data).subscribe((result: any) => {
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
    this.captainRequestService.getCaptains(data).subscribe((result: any) => {
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
    this.captainRequestService.getCaptainById(id).subscribe((result: any) => {
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

        this.captainRequestService
          .uploadDocumnet(formData)
          .subscribe((result: any) => {
            if (result.statusCode == 200) {
              console.log('Documnet uploaded', result);
            } else {
              console.log('Failed to upload documnet');
            }
          });
      }
    }
  }
}
