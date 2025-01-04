import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';
import { LoginService } from '../../services/login/login.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    FormsModule,
    HttpClientModule,
  ],
  providers: [LoginService],
})
export class LoginComponent {
  constructor(private loginService: LoginService, private router: Router) {}

  loginData = {
    email: '',
    password: '',
  };

  login() {
    this.loginService.login(this.loginData).subscribe((result: any) => {
      if (result.statuscode == 200) {
        console.log('Login success', result);
        localStorage.setItem('token', result.token);
        this.router.navigate(['/dashboard']);
      } else {
        console.log('Login failed');
      }
    });
  }
}
