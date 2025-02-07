import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { CaptainLoginService } from '../captain-login/captain-login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardCaptain implements CanActivate {
  constructor(
    private captainLoginService: CaptainLoginService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.captainLoginService.iscaptainLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
