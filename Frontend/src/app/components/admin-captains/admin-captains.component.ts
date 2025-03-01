import { Component } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-captains',
  standalone: false,
  templateUrl: './admin-captains.component.html',
  styleUrl: './admin-captains.component.css',
})
export class AdminCaptainsComponent {
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.getCaptains();
  }

  activeCaptains: any = [];
  deletedCaptains: any = [];

  getCaptains() {
    const data = {
      page: this.activeCaptainscurrentPage,
      perPage: this.activeCaptainsTableSize,
      isDeleted: false,
    };
    this.adminService.getAllCaptains(data).subscribe((result: any) => {
      if (result.statuscode === 200) {
        console.log('Active captains', result);
        this.activeCaptains = result.data;
        this.totalActiveCaptains = result.totalCaptains;
      } else {
        console.log('Failed to get active captains');
      }
    });
  }

  getDeletedCaptains() {
    const data = {
      page: this.deletedCaptainscurrentPage,
      perPage: this.deletedCaptainsTableSize,
      isDeleted: true,
    };
    this.adminService.getAllCaptains(data).subscribe((result: any) => {
      if (result.statuscode === 200) {
        console.log('Deleted captains', result);
        this.deletedCaptains = result.data;
        this.totalDeletedCaptains = result.totalCaptains;
      } else {
        console.log('Failed to get deleted captains');
      }
    });
  }

  activeCaptainscurrentPage: number = 1;
  activeCaptainsTableSize: number = 5;
  totalActiveCaptains: any = 0;

  onTableActiveCaptainDataChange(event: any) {
    this.activeCaptainscurrentPage = event;
    this.getCaptains();
  }

  deletedCaptainscurrentPage: number = 1;
  deletedCaptainsTableSize: number = 5;
  totalDeletedCaptains: any = 0;

  onTableDeletedCaptainDataChange(event: any) {
    this.deletedCaptainscurrentPage = event;
    this.getDeletedCaptains();
  }

  ExportList: any = [];

  exportActiveTableToExcel(isDeleted: any): void {
    const data = {
      page: 1,
      perPage: 1000,
      isDeleted: isDeleted,
    };
    this.adminService.getAllCaptains(data).subscribe((response: any) => {
      if (response.statuscode == 200) {
        this.ExportList = response.data.map((captain: any) => ({
          Id: captain._id,
          Firstname: captain.fullname.firstname,
          Lastname: captain.fullname.lastname,
          Email: captain.email,
          Vehiclecolor: captain.vehicle.color,
          Vehicleplate: captain.vehicle.plate,
          Vehiclecapacity: captain.vehicle.capacity,
          Vehicletype: captain.vehicle.vehicleType,
          Status: captain.status,
          Totalearning: captain.totalEarning,
        }));

        console.log('Export List', this.ExportList);

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
          this.ExportList
        );

        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Export List');

        if (isDeleted === false) {
          XLSX.writeFile(workbook, 'Active Captains.xlsx');
        } else {
          XLSX.writeFile(workbook, 'Delete Captains.xlsx');
        }
      } else {
        console.log('Failed to export');
      }
    });
  }
}
