import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-captain-profile',
  templateUrl: './captain-profile.component.html',
  styleUrl: './captain-profile.component.css',
})
export class CaptainProfileComponent {
  showDocument() {
    Swal.fire({
      imageUrl: '',
      imageHeight: 200,
      imageWidth: 200,
      imageAlt: 'A tall image',
      customClass: {
        confirmButton: 'swal-confirm-btn',
      },
    });
  }
}
