import { Component } from '@angular/core';
import { UserWalletService } from '../../services/user-wallet/user-wallet.service';
import { PaymentService } from '../../services/payment/payment.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environment/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
declare var Razorpay: any;

@Component({
  selector: 'app-wallet-user',
  templateUrl: './wallet-user.component.html',
  styleUrl: './wallet-user.component.css',
  standalone: false,
})
export class WalletUserComponent {
  constructor(
    private userWalletService: UserWalletService,
    private paymentService: PaymentService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {}

  ngOnInit() {
    this.getUserWallet();
    this.getAllUserWalletTranscation();

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.defer = true;
    document.body.appendChild(script);
  }

  wallet: any;
  getUserWallet() {
    this.spinner.show();

    this.userWalletService.getUserWallet().subscribe({
      next: (result: any) => {
        if (result.statusCode === 200) {
          this.spinner.hide();
          console.log('wallet details', result.data);
          this.wallet = result.data;
          // this.toaster.success(result.message);
        }
      },
      error: (error) => {
        console.log('wallet data error', error.error);

        if (
          error.error.statusCode == 404 ||
          error.error.statusCode == 500 ||
          error.error.statusCode == 401
        ) {
          this.spinner.hide();
          this.toaster.error(error.error.message);
        } else {
          this.toaster.error('Something went wrong');
        }
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  walletTranscations: any;
  getAllUserWalletTranscation() {
    this.spinner.show();

    this.userWalletService
      .getAllCaptainWalletTranscation({
        page: this.activeTransactioncurrentPage,
        perPage: this.activeTransactionTableSize,
      })
      .subscribe({
        next: (result: any) => {
          if (result.statusCode === 200) {
            this.spinner.hide();
            console.log('wallet transcation data', result.data);
            this.walletTranscations = result.data.transactions;
            this.totalTransaction = result.data.totalTransactions;
            // this.toaster.success(result.message);
          }
        },
        error: (error) => {
          console.log('wallet transcation data error', error.error);

          if (
            error.error.statusCode == 404 ||
            error.error.statusCode == 500 ||
            error.error.statusCode == 401 ||
            error.error.statusCode == 400
          ) {
            this.spinner.hide();
            this.toaster.error(error.error.message);
          } else {
            this.toaster.error('Something went wrong');
          }
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }

  activeTransactioncurrentPage: number = 1;
  activeTransactionTableSize: number = 5;
  totalTransaction: any = 0;

  onTableActiveRideDataChange(event: any) {
    this.activeTransactioncurrentPage = event;
    this.getAllUserWalletTranscation();
  }

  addCashAmount: any;
  options: any;
  paymentInit() {
    // console.log('Add cash amount', this.addCashAmount);
    this.spinner.show();

    this.paymentService
      .paymentInit({ amount: this.addCashAmount * 10 })
      .subscribe({
        next: (order: any) => {
          this.spinner.hide();
          this.options = {
            key: environment.RAZORPAY_KEY,
            amount: order.order.amount,
            currency: 'INR',
            name: 'Rider',
            description: 'Rider Payment',
            order_id: order.order.id,
            handler: (response: any) => {
              // console.log('Payment Response:', response);
              this.paymentVerification(response);
            },
            prefill: {
              name: 'test',
              email: 'test@gmail.com',
              contact: '8568547585',
            },
            theme: {
              color: 'black',
            },
          };

          var rzp = new Razorpay(this.options);
          rzp.open();
        },
        error: (error) => {
          console.log('payment error', error.error);
          this.spinner.hide();

          if (
            error.error.statusCode == 400 ||
            error.error.statusCode == 500 ||
            error.error.statusCode == 401
          ) {
            this.toaster.error(error.error.message);
          } else {
            this.toaster.error('Something went wrong');
          }
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }

  paymentVerification(response: any) {
    this.spinner.show();
    this.paymentService.paymentVerify(response).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Payment verify data', result);
          this.addAmountInUserWallet(result.razorpay_payment_id);
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log('Payment verify data error', error.error);

        if (
          error.error.statusCode == 400 ||
          error.error.statusCode == 500 ||
          error.error.statusCode == 404
        ) {
          this.toaster.error(error.error.message);
        } else {
          this.toaster.error('Something went wrong');
        }
      },
    });
  }

  addAmountInUserWallet(paymentId: any) {
    this.spinner.show();

    this.userWalletService
      .addAmountInUserWallet({
        amount: this.addCashAmount,
        transactionId: paymentId,
      })
      .subscribe({
        next: (result: any) => {
          if (result.statusCode === 200) {
            this.spinner.hide();
            console.log('add amount in wallet', result.data);
            // this.toaster.success(result.message);
            this.addAmountNotifi();
            this.getUserWallet();
            this.getAllUserWalletTranscation();
          }
        },
        error: (error) => {
          console.log('add amount in wallet error', error.error);

          if (
            error.error.statusCode == 404 ||
            error.error.statusCode == 500 ||
            error.error.statusCode == 401 ||
            error.error.statusCode == 400
          ) {
            this.spinner.hide();
            this.toaster.error(error.error.message);
          } else {
            this.toaster.error('Something went wrong');
          }
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }

  addAmountNotifi() {
    Swal.fire({
      title: 'Funds Added!',
      text: "You've successfully added funds to your wallet.",
      icon: 'success',
      confirmButtonColor: 'black',
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        this.route.navigate(['/wallet-user']);
        this.addCashAmount = '';
      }
    });
  }
}
