import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService, JwtService } from '@app/core';
import { take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (!this.authService.isAuthenticated.pipe(take(1)) || this.jwtService.hasExpired()) {
        console.log('You shall not pass!')
        return false;
    }
    const isAuthorized = route.data.roles ?
    route.data.role.indexOf(this.authService.getCurrentUser().role) !== -1 :
    true;
    return isAuthorized;
  }
}
