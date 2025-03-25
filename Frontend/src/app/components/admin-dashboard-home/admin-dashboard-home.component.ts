import { Component } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-admin-dashboard-home',
    templateUrl: './admin-dashboard-home.component.html',
    styleUrl: './admin-dashboard-home.component.css',
    standalone: false
})
export class AdminDashboardHomeComponent {
    constructor(
        private adminservice: AdminService,
        private spinner: NgxSpinnerService,
        private toaster: ToastrService
    ) {}

    ngOnInit(): void {
        this.getAllRides(); 
        this.getAllUsers();
        this.getAllCaptains();  
    }

    totalRides: any;
    totalUsers: any;
    totalCaptains: any;
    todaysRides: any;

    getAllRides(){
        this.spinner.show();

        this.adminservice.getRides({ page: 1, perPage: 50 }).subscribe({
            next: (result: any) => {
                if(result.statuscode === 200){
                    this.spinner.hide();
                    console.log("All rides data", result);
                    this.totalRides = result.totalRides; 
                    this.todaysRides = result.data?.filter((ride: any) => {
                        const rideDate = new Date(ride.createOn).toDateString();
                        const todayDate = new Date().toDateString();
                        return rideDate === todayDate;
                    });
                    // console.log(this.todaysRides);
                                     
                }
            },
            error: (error: any) => {
                this.spinner.hide();
                console.log("All rides data error", error.error);
                this.toaster.error(error.error.message);
            },
            complete: () => {
                this.spinner.hide();
            }
        });
    }

    getAllUsers(){
        this.spinner.show();

        this.adminservice.getAllUsers({ page: 1, perPage: 50, isDeleted: false }).subscribe({
            next: (result: any) => {
                if(result.statuscode === 200){
                    this.spinner.hide();
                    console.log("All users data", result);
                    this.totalUsers = result.totalUsers;                   
                }
            },
            error: (error: any) => {
                this.spinner.hide();
                console.log("All users data error", error.error);
                this.toaster.error(error.error.message);
            },
            complete: () => {
                this.spinner.hide();
            }
        });
    }

    getAllCaptains(){
        this.spinner.show();

        this.adminservice.getAllCaptains({ page: 1, perPage: 50, isDeleted: false }).subscribe({
            next: (result: any) => {
                if(result.statuscode === 200){
                    this.spinner.hide();
                    console.log("All captains data", result);
                    this.totalCaptains = result.totalCaptains;                   
                }
            },
            error: (error: any) => {
                this.spinner.hide();
                console.log("All captains data error", error.error);
                this.toaster.error(error.error.message);
            },
            complete: () => {
                this.spinner.hide();
            }
        });
    }

}
