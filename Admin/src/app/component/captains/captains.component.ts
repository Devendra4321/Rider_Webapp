import { Component } from '@angular/core';
import { CaptainService } from '../../services/captains/captain.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-captains',
  imports: [HttpClientModule, CommonModule, NgbPaginationModule],
  templateUrl: './captains.component.html',
  styleUrl: './captains.component.scss',
  providers: [CaptainService],
})
export class CaptainsComponent {
  constructor(private captainService: CaptainService) {}

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
    this.captainService.getAllCaptains(data).subscribe((result: any) => {
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
    this.captainService.getAllCaptains(data).subscribe((result: any) => {
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
    this.captainService.getAllCaptains(data).subscribe((response: any) => {
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
