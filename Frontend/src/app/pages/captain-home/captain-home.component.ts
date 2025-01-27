import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-captain-home',
  templateUrl: './captain-home.component.html',
  styleUrl: './captain-home.component.css',
})
export class CaptainHomeComponent {
  isOnline: boolean = false;

  ngOnInit() {
    const savedState = localStorage.getItem('isOnline');
    if (savedState !== null) {
      this.isOnline = JSON.parse(savedState);
    }
  }

  toggleCaptainStatus() {
    this.isOnline = !this.isOnline;
    localStorage.setItem('isOnline', JSON.stringify(this.isOnline));

    if (this.isOnline) {
      Swal.fire({
        title: 'Good job!',
        text: 'You are now Online',
        icon: 'success',
        confirmButtonText: 'ok',
        showCloseButton: true,
        customClass: {
          confirmButton: 'swal-confirm-btn',
        },
      });
    } else {
      Swal.fire({
        title: 'Ooops!',
        text: 'You are now Offline',
        icon: 'error',
        confirmButtonText: 'ok',
        showCloseButton: true,
        customClass: {
          confirmButton: 'swal-confirm-btn',
        },
      });
    }
  }
}
