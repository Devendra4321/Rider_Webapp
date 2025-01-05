import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '../../services/users/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [HttpClientModule, CommonModule, NgbPaginationModule],
  providers: [UserService],
})
export class UsersComponent {
  constructor(private userSevice: UserService) {}

  ngOnInit() {
    this.getUsers();
  }

  activeUsers: any = [];
  deletedUsers: any = [];

  getUsers() {
    const data = {
      page: this.activeUserscurrentPage,
      perPage: this.activeUsersTableSize,
      isDeleted: false,
    };
    this.userSevice.getAllUsers(data).subscribe((result: any) => {
      if (result.statuscode == 200) {
        console.log('Users fetched', result);
        this.activeUsers = result.data;
        this.totalActiveUsers = result.totalUsers;
      } else {
        console.log('Failed to fetch users');
      }
    });
  }

  getDeletedUsers() {
    const data = {
      page: this.deletedUserscurrentPage,
      perPage: this.deletedUsersTableSize,
      isDeleted: true,
    };
    this.userSevice.getAllUsers(data).subscribe((result: any) => {
      if (result.statuscode == 200) {
        console.log('Deleted users ', result);
        this.deletedUsers = result.data;
        this.totalDeletedUsers = result.totalUsers;
      } else {
        console.log('Failed to fetch deleted users');
      }
    });
  }

  activeUserscurrentPage: number = 1;
  activeUsersTableSize: number = 5;
  totalActiveUsers: any = 0;

  deletedUserscurrentPage: number = 1;
  deletedUsersTableSize: number = 5;
  totalDeletedUsers: any = 0;

  onTableActiveUserDataChange(event: any) {
    this.activeUserscurrentPage = event;
    this.getUsers();
  }

  onTableDeletedUserDataChange(event: any) {
    this.deletedUserscurrentPage = event;
    this.getDeletedUsers();
  }

  ExportList: any = [];

  exportActiveTableToExcel(isDeleted: any): void {
    const data = {
      page: 1,
      perPage: 1000,
      isDeleted: isDeleted,
    };
    this.userSevice.getAllUsers(data).subscribe((response: any) => {
      if (response.statuscode == 200) {
        this.ExportList = response.data.map((user: any) => ({
          Id: user._id,
          Firstname: user.fullname.firstname,
          Lastname: user.fullname.lastname,
          Email: user.email,
          Emailverified: user.isEmailVerified,
        }));

        console.log('Export List', this.ExportList);

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
          this.ExportList
        );

        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Export List');

        if (isDeleted === false) {
          XLSX.writeFile(workbook, 'Active Users.xlsx');
        } else {
          XLSX.writeFile(workbook, 'Delete Users.xlsx');
        }
      } else {
        console.log('Failed to export');
      }
    });
  }
}
