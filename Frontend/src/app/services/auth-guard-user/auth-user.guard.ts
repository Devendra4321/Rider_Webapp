import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardUser implements CanActivate {
  constructor(private userLoginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    if (this.userLoginService.isUserLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
