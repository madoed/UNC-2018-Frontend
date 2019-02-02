import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    console.log('you shall not pass!')
    if (!this.authService.isAuthenticated)
      return false;
    return route.data.roles ?
    route.data.role.indexOf(this.authService.getCurrentUser().role) !== -1 :
    true;
  }
}
