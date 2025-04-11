import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { CaptainWalletService } from '../../services/captain-wallet/captain-wallet.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaymentService } from '../../services/payment/payment.service';
import { environment } from '../../../environment/environment';
import { Router } from '@angular/router';
declare var Razorpay: any;

@Component({
  selector: 'app-wallet-captain',
  templateUrl: './wallet-captain.component.html',
  styleUrl: './wallet-captain.component.css',
  standalone: false,
})
export class WalletCaptainComponent {
  constructor(
    private captainWalletService: CaptainWalletService,
    private paymentService: PaymentService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {}

  ngOnInit() {
    this.getCaptainWallet();
    this.getAllCaptainWalletTranscation();

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.defer = true;
    document.body.appendChild(script);
  }

  wallet: any;

  getCaptainWallet() {
    this.spinner.show();

    this.captainWalletService.getCaptainWallet().subscribe({
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

  getAllCaptainWalletTranscation() {
    this.spinner.show();

    this.captainWalletService
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
    this.getAllCaptainWalletTranscation();
  }

  addCashAmount: any;
  options: any;

  paymentInit() {
    // console.log('Add cash amount', this.addCashAmount);
    this.spinner.show();

    this.paymentService
      .walletPaymentInit({ amount: this.addCashAmount * 10 })
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

          if (
            error.error.statusCode == 400 ||
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

  paymentVerification(response: any) {
    this.spinner.show();

    this.paymentService.walletPaymentVerify(response).subscribe({
      next: (result: any) => {
        if (result.statusCode == 200) {
          this.spinner.hide();
          console.log('Payment verify data', result);
          this.addAmountInCaptainWallet(result.razorpay_payment_id);
        }
      },
      error: (error) => {
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

  addAmountInCaptainWallet(paymentId: any) {
    this.spinner.show();

    this.captainWalletService
      .addAmountInCaptainWallet({
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
            this.getCaptainWallet();
            this.getAllCaptainWalletTranscation();
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
        this.route.navigate(['/wallet-captain']);
        this.addCashAmount = '';
      }
    });
  }

  withdrawCashAmount: any;

  withdrawCash() {
    this.spinner.show();

    this.captainWalletService
      .withdrawalAmountInCaptainWallet({
        amount: this.withdrawCashAmount,
      })
      .subscribe({
        next: (result: any) => {
          if (result.statusCode === 200) {
            this.spinner.hide();
            console.log('withdraw amount in wallet', result.data);
            // this.toaster.success(result.message);
            this.withdrawCashNotfi();
            this.getCaptainWallet();
            this.getAllCaptainWalletTranscation();
          }
        },
        error: (error) => {
          console.log('withdraw amount in wallet error', error.error);

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

  withdrawCashNotfi() {
    Swal.fire({
      title: 'Funds withdraw!',
      text: "You've successfully withdraw funds on your wallet.",
      icon: 'success',
      confirmButtonColor: 'black',
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        this.route.navigate(['/wallet-captain']);
        this.withdrawCashAmount = '';
      }
    });
  }
}
