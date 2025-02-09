import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-wallet-captain',
    templateUrl: './wallet-captain.component.html',
    styleUrl: './wallet-captain.component.css',
    standalone: false
})
export class WalletCaptainComponent {
  // ngOnInit() {
  //   this.withdrawCashNotfi();
  // }

  withdrawCashNotfi() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you want to withdraw money to your bank account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Withdraw!',
          text: 'Your have been succesfully withdraw money.',
          icon: 'success',
        });
      }
    });
  }
}
